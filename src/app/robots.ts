import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/x-factor-admin/'],
    },
    sitemap: 'https://xfactorpeptides.com/sitemap.xml',
  };
}
