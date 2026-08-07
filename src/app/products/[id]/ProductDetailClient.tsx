"use client";
import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Product, ProductCard } from '@/components/products/ProductData';
import Link from 'next/link';
import { AlertTriangle, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export function ProductDetailClient({ productId }: { productId: string }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = React.useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);

  React.useEffect(() => {
    async function loadData() {
      const { getProductById, getProducts } = await import('@/lib/api');
      const data = await getProductById(productId);
      const allProducts = await getProducts();
      setProduct(data);
      setRelatedProducts(allProducts.filter(p => p.id !== productId).slice(0, 3));
      setLoading(false);
    }
    if (productId) loadData();
  }, [productId]);

  React.useEffect(() => {
    setSelectedVariantIndex(0);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-display font-bold">Loading product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-display font-bold">Product not found</h1>
        <Link href="/shop" className="text-secondary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants[selectedVariantIndex];
    addItem({
      id: product.id,
      cartItemId: `${product.id}-${variant.size}`,
      name: product.name,
      price: variant.price,
      size: variant.size,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Product Image */}
            <div className="bg-card border border-border rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden group">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                <span className="font-mono text-xs text-white tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm">{product.id.toUpperCase()}</span>
                <span className="font-mono text-xs text-white tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm">{product.specs.mw}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-3">
                <span className="eyebrow m-0">{product.category}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-muted-foreground">{product.reviews.rating} ({product.reviews.count} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-display font-semibold text-accent mb-6">${product.variants[selectedVariantIndex].price.toFixed(2)}</p>
              
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <Button
                        key={v.size}
                        variant={i === selectedVariantIndex ? "default" : "outline"}
                        className={i === selectedVariantIndex ? "bg-accent hover:bg-accent/90" : ""}
                        onClick={() => setSelectedVariantIndex(i)}
                      >
                        {v.size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="prose prose-invert border-b border-border/50 pb-8 mb-8">
                <p className="text-lg text-foreground/90">{product.shortDesc}</p>
                <p className="text-muted-foreground mt-4">{product.longDesc}</p>
              </div>

              <div className="mb-8">
                <h3 className="font-display font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Purity</p>
                    <p className="font-mono font-medium">{product.specs.purity}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Format</p>
                    <p className="font-mono font-medium">{product.specs.format}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Storage</p>
                    <p className="font-mono font-medium">{product.specs.storage}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Molecular Weight</p>
                    <p className="font-mono font-medium">{product.specs.mw}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg text-sm text-foreground/80">
                  <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p>
                    <strong>RESEARCH USE ONLY:</strong> This product is not intended for human consumption. It is sold exclusively for laboratory research purposes. Customers are responsible for compliance with applicable laws in their jurisdiction.
                  </p>
                </div>
                
                <Button onClick={handleAddToCart} size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white mt-4 shadow-[0_0_20px_rgba(11,95,255,0.3)]">
                  Add to Cart
                </Button>
              </div>
            </div>

          </div>

          {/* Related Products */}
          <div className="mt-32">
            <h2 className="text-3xl font-display font-bold mb-8">Related Research Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
