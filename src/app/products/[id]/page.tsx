import { getProducts, getProductById } from '@/lib/api';
import { ProductDetailClient } from './ProductDetailClient';
import Script from 'next/script';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `https://xfactorpeptides.com${product.imageUrl}`,
    description: product.longDesc,
    offers: {
      '@type': 'AggregateOffer',
      offerCount: product.variants.length,
      lowPrice: Math.min(...product.variants.map((v) => v.price)),
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: product.reviews ? {
      '@type': 'AggregateRating',
      ratingValue: product.reviews.rating,
      reviewCount: product.reviews.count,
    } : undefined,
  } : null;

  return (
    <>
      {jsonLd && (
        <Script
          id={`product-schema-${id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient productId={id} />
    </>
  );
}
