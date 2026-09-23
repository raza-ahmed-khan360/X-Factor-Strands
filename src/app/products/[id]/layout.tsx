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
    openGraph: {
      title: `${product.name} | Premium Research Peptides`,
      description: product.shortDesc,
      url: `https://xfactorpeptides.com/products/${id}`,
      siteName: "X-Factor Peptides",
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
      type: "website", // Product type requires more complex integration, website works well
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDesc,
      images: [product.imageUrl],
    }
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
