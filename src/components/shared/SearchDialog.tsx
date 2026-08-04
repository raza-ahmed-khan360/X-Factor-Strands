import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Search, X  } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { productData } from '@/components/products/ProductData';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [open]);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return productData.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.shortDesc.toLowerCase().includes(lowerQuery) ||
        p.id.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const handleSelect = (id: string) => {
    onOpenChange(false);
    router.push(`/products/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-background border-border shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
            placeholder="Search products, categories, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-md text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No products found matching "{query}"
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.id)}
                  className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors group"
                >
                  <div className="w-12 h-12 rounded bg-background border border-border overflow-hidden shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-sm font-medium text-foreground ml-4 shrink-0">
                        {product.variants?.[0]?.price ? `$${product.variants[0].price.toFixed(2)}` : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.category} &bull; {product.specs.mw}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {!query.trim() && (
            <div className="p-6 text-center text-muted-foreground text-sm">
              Type to start searching...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
