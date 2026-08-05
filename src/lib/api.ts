import { supabase } from './supabase';
import { Product, ProductVariant } from '../components/products/ProductData';

// Fetch all products with their variants
export async function getProducts(): Promise<Product[]> {
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('active', true);

  if (productsError) {
    console.error('Error fetching products:', productsError);
    return [];
  }

  const { data: variantsData, error: variantsError } = await supabase
    .from('variants')
    .select('*');

  if (variantsError) {
    console.error('Error fetching variants:', variantsError);
    return [];
  }

  // Map database rows to Frontend Product interface
  return productsData.map(product => {
    const productVariants = variantsData
      .filter(v => v.product_id === product.id)
      .map(v => ({
        size: v.size,
        price: v.price,
        stripe_price_id: v.stripe_price_id
      }));

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      shortDesc: product.description?.substring(0, 100) + '...' || '',
      longDesc: product.description || '',
      imageUrl: product.image_url || '',
      // Provide fallback values for UI fields not in database yet
      specs: {
        purity: '>99.0%',
        format: 'Lyophilized Powder',
        storage: 'Store at -20°C',
        mw: 'Varies',
      },
      reviews: {
        rating: 4.9,
        count: Math.floor(Math.random() * 50) + 10,
      },
      variants: productVariants,
    };
  });
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}
