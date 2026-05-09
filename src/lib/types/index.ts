import { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string;
  fullName: string | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  businessType: string | null;
  targetAudience: string | null;
  brandTone: string | null;
  language: string;
  context: Record<string, any>;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

export type Generation = {
  id: string;
  userId: string;
  projectId: string;
  toolSlug: string;
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
  isFavorite: boolean;
  createdAt: Timestamp | Date;
};

export type Document = {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

export type ToolRun = {
  id: string;
  userId: string;
  projectId: string;
  toolSlug: string;
  status: 'pending' | 'success' | 'error';
  errorMessage: string | null;
  createdAt: Timestamp | Date;
};
