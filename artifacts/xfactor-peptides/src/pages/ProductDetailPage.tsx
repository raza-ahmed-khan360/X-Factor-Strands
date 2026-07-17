import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { productData, AbstractMoleculeIcon, ProductCard } from '@/components/products/ProductData';
import { useRoute, Link } from 'wouter';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const [match, params] = useRoute('/products/:id');
  const productId = params?.id;
  
  const product = productData.find(p => p.id === productId);
  const relatedProducts = productData.filter(p => p.id !== productId).slice(0, 3);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-display font-bold">Product not found</h1>
        <Link href="/shop" className="text-secondary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Product Image / Abstract Art */}
            <div className="bg-card border border-border rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent to-transparent" />
              
              <AbstractMoleculeIcon 
                color={product.iconColor} 
                className="w-1/2 h-1/2 relative z-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform duration-700" 
              />
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">{product.id.toUpperCase()}</span>
                <span className="font-mono text-xs text-muted-foreground/50 tracking-widest">{product.specs.mw}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="eyebrow mb-3">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-display font-semibold text-accent mb-6">{product.price}</p>
              
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
                
                <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white mt-4 shadow-[0_0_20px_rgba(11,95,255,0.3)]">
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
