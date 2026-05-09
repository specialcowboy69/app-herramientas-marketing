import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/projects/',
        '/settings/',
        '/favorites/',
        '/dashboard/',
        '/api/'
      ],
    },
    sitemap: 'https://copianiches.com/sitemap.xml',
  };
}
