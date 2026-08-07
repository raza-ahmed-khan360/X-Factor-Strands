import { productData } from '@/components/products/ProductData';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateStaticParams() {
  return productData.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
