import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { productData, ProductCard } from '@/components/products/ProductData';
import { Link } from 'wouter';
import { Search, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function ShopPage() {
  const categories = [
    'Weight Management',
    'Recovery',
    'Performance',
    'Sleep',
    'Focus & Cognitive',
    'Energy'
  ];

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center justify-between">
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <label key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-5 h-5 rounded border border-border flex items-center justify-center group-hover:border-accent transition-colors">
                <div className="w-3 h-3 bg-transparent rounded-sm" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg mb-4">Price Range</h3>
        <div className="pt-4 px-2">
          <div className="h-1 bg-border rounded-full relative">
            <div className="absolute left-0 right-1/3 h-full bg-secondary rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-secondary cursor-pointer" />
            <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-secondary cursor-pointer transform translate-x-1/2" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-4 font-display">
            <span>$20.00</span>
            <span>$50.00</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-5 mt-8">
        <h4 className="font-display font-medium text-sm text-accent mb-2">Compliance Notice</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          By purchasing, you confirm you are a qualified researcher. Products are not for diagnostic or therapeutic use.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        {/* Header Block */}
        <div className="bg-card border-b border-border py-12">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Research Products</h1>
            <p className="text-muted-foreground text-lg">
              All products are for laboratory and scientific research purposes only. Not intended for human consumption.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 mt-12 flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Showing {productData.length} products</p>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto w-full sm:w-[400px]">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="text-2xl font-display">Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
            <FilterContent />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">Showing {productData.length} products</p>
              <div className="relative w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {productData.map(product => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <ProductCard product={product} />
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
