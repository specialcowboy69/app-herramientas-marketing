import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    
    // next/headers requires awaiting in Next 15 depending on the context, but passing it to get is usually fine
    // Let's ensure we get the signature safely
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const firebaseUID = (session as any).subscription_data?.metadata?.firebaseUID || session.client_reference_id;
        
        if (firebaseUID && session.subscription) {
          // Obtener el final del periodo del objeto subscription
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await adminDb.collection('users').doc(firebaseUID).set({
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000)
          }, { merge: true });
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find the user holding this subscription
        const snapshot = await adminDb.collection('users')
          .where('subscriptionId', '==', subscription.id)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          await doc.ref.update({
            subscriptionStatus: subscription.status,
            currentPeriodEnd: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000)
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook payload parsing error', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
