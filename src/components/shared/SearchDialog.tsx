"use client";
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product, productData } from '@/components/products/ProductData';
import { getProducts } from '@/lib/api';
import { smartSearchProducts, POPULAR_SUGGESTION_TAGS } from '@/lib/search';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(productData);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch dynamic products on load or dialog open
  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load search products:', err);
      }
    }
    if (open) {
      load();
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [open]);

  // Smart Search Results
  const results = React.useMemo(() => {
    return smartSearchProducts(products, query);
  }, [products, query]);

  // Top 4 Featured Suggestions for Empty State
  const featuredSuggestions = React.useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const handleSelect = (id: string) => {
    onOpenChange(false);
    router.push(`/products/${id}`);
  };

  const handleTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    inputRef.current?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-background border-border shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        
        {/* Search Header Input */}
        <div className="flex items-center border-b border-border px-5 py-4 bg-card/50">
          <Search className="w-5 h-5 text-accent shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg font-medium"
            placeholder="Search compounds (e.g., GLP-1, BPC-157, fat loss, recovery)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {/* Active Query Results */}
          {query.trim() !== '' ? (
            results.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground space-y-3">
                <p className="text-base">No products found matching "<span className="text-foreground font-semibold">{query}</span>"</p>
                <p className="text-xs text-muted-foreground">Try searching by category (e.g. Weight Management, Recovery) or compound name.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                    Matching Results ({results.length})
                  </span>
                  <span className="text-xs text-accent font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Smart Matched
                  </span>
                </div>
                
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="w-full text-left flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-border hover:bg-card/80 transition-all duration-200 group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-white border border-border p-1 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-display font-bold text-foreground text-base truncate group-hover:text-accent transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-sm font-display font-bold text-accent ml-4 shrink-0">
                          {product.variants?.[0]?.price ? `From $${product.variants[0].price.toFixed(2)}` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        <span className="text-accent font-medium">{product.category}</span> &bull; {product.shortDesc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )
          ) : (
            /* Empty State: Suggestions & Popular Tags */
            <div className="space-y-6">
              {/* Popular Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-1 text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5 text-accent" />
                  <span>Popular Research Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SUGGESTION_TAGS.map((tag) => (
                    <button
                      key={tag.label}
                      onClick={() => handleTagClick(tag.query)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-card border border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Featured Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-1 text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Suggested Compounds</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredSuggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="text-left flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border hover:border-accent hover:bg-card transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white border border-border p-1 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-display font-bold text-sm text-foreground truncate group-hover:text-accent transition-colors">
                          {product.name}
                        </h5>
                        <p className="text-xs text-accent font-medium">
                          ${product.variants?.[0]?.price?.toFixed(2) ?? '0.00'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
