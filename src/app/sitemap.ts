import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://xfactorpeptides.com';

  // Core static routes
  const staticRoutes = [
    '',
    '/about',
    '/shop',
    '/faq',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
    '/research-disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic product routes
  const products = await getProducts();
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
