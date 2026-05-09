import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://copianiches.com';

  const staticRoutes = [
    '',
    '/pricing',
    '/login',
    '/signup',
    '/tools',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const toolRoutes = [
    'ads-generator',
    'blog-toolkit',
    'business-idea',
    'cta-generator',
    'customer-avatar',
    'naming-slogan',
    'pain-points',
    'product-description',
    'seo-brief'
  ].map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}
