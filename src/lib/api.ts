import { sortVariants } from './utils';
import { supabase } from './supabase';
import { Product, productData } from '../components/products/ProductData';

// Fetch all products with their variants
export async function getProducts(): Promise<Product[]> {
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);

    if (productsError || !productsData || productsData.length === 0) {
      return productData;
    }

    const { data: variantsData } = await supabase
      .from('variants')
      .select('*');

    // Map database rows to Frontend Product interface
    const mappedProducts = productsData.map(product => {
      const productVariants = (variantsData || [])
        .filter(v => v.product_id === product.id)
        .map(v => ({
          size: v.size,
          price: Number(v.price) || 0,
          stripe_price_id: v.stripe_price_id
        }));

      // Ensure there is at least one variant fallback if database record has no variants yet
      const finalVariants = productVariants.length > 0 
        ? productVariants 
        : [{ size: '10mg', price: 50, stripe_price_id: null }];

      return {
        id: product.id,
        name: product.name,
        category: product.category || 'Weight Management',
        shortDesc: product.description ? (product.description.substring(0, 100) + '...') : 'High-quality research compound.',
        longDesc: product.description || 'High-quality research compound for laboratory use.',
        imageUrl: product.image_url || '/new-products/semaglutide-glp1.jpeg',
        specs: {
          purity: '>99.0%',
          format: 'Lyophilized Powder',
          storage: 'Store at -20°C',
          mw: 'Varies',
        },
        reviews: {
          rating: 5.0,
          count: 35,
        },
        variants: sortVariants(finalVariants),
      };
    });

    return mappedProducts.length > 0 ? mappedProducts : productData;
  } catch (err) {
    console.error('Error in getProducts:', err);
    return productData;
  }
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}
