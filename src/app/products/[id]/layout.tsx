import type { Metadata } from 'next';
import { getProductById } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | X-Factor Peptides',
      description: 'The requested product could not be found.',
    };
  }
  
  return {
    title: `${product.name} | X-Factor Peptides`,
    description: product.shortDesc,
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
