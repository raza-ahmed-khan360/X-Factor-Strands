import * as React from 'react';
import { Star } from 'lucide-react';

export const productData = [
  {
    id: "mb-1",
    name: "Metabolic Research Complex MB-1",
    category: "Weight Management",
    price: "$29.99",
    shortDesc: "A research compound studied for its role in metabolic signalling pathways.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in lipolytic and metabolic pathways. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "1.2kDa" },
    imageUrl: "/products/MB-1.png",
    reviews: { rating: 4.8, count: 124 }
  },
  {
    id: "rc-2",
    name: "Recovery Research Blend RC-2",
    category: "Recovery",
    price: "$34.99",
    shortDesc: "Laboratory peptide investigated for cellular repair and regeneration research.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in tissue repair mechanisms and cellular regeneration. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">98.5%", format: "Lyophilised", storage: "-20°C", mw: "2.4kDa" },
    imageUrl: "/products/RC-2.png",
    reviews: { rating: 4.9, count: 89 }
  },
  {
    id: "pf-3",
    name: "Performance Research Series PF-3",
    category: "Performance",
    price: "$32.99",
    shortDesc: "Research compound studied for physiological performance markers.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in muscular endurance and physiological performance markers. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "1.8kDa" },
    imageUrl: "/products/PF-3.png",
    reviews: { rating: 4.7, count: 210 }
  },
  {
    id: "sl-4",
    name: "Sleep Research Peptide SL-4",
    category: "Sleep",
    price: "$27.99",
    shortDesc: "Compound investigated for circadian rhythm and sleep architecture research.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in circadian rhythm regulation and deep sleep architecture. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99.2%", format: "Lyophilised", storage: "-20°C", mw: "1.5kDa" },
    imageUrl: "/products/SL-4.png",
    reviews: { rating: 4.9, count: 156 }
  },
  {
    id: "fc-5",
    name: "Focus Research Peptide FC-5",
    category: "Focus & Cognitive",
    price: "$31.99",
    shortDesc: "Research peptide studied for neurological cognitive function pathways.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in neurological pathways associated with cognitive function and focus. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">98%", format: "Lyophilised", storage: "-20°C", mw: "3.1kDa" },
    imageUrl: "/products/FC-5.png",
    reviews: { rating: 4.8, count: 92 }
  },
  {
    id: "en-6",
    name: "Energy Research Complex EN-6",
    category: "Energy",
    price: "$29.99",
    shortDesc: "Compound explored for mitochondrial function and cellular energy research.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in mitochondrial function and energy metabolism. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "2.1kDa" },
    imageUrl: "/products/EN-6.png",
    reviews: { rating: 4.6, count: 74 }
  }
];

export function ProductCard({ product }: { product: typeof productData[0] }) {
  return (
    <div className="bg-card border border-border rounded-xl flex flex-col glow-hover group relative overflow-hidden p-0 h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      
      {/* Image Container - Full width top */}
      <div className="w-full h-56 bg-background relative overflow-hidden shrink-0 border-b border-border">
         <img 
           src={product.imageUrl} 
           alt={product.name} 
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
         />
         <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm z-10">
           <span className="text-sm font-display font-bold text-foreground">{product.price}</span>
         </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-display uppercase tracking-wider text-accent font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-medium text-muted-foreground">{product.reviews.rating} ({product.reviews.count})</span>
            </div>
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground leading-tight mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDesc}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-border/50">
          <button className="w-full py-2.5 rounded-md border border-secondary text-secondary font-medium text-sm hover:bg-secondary hover:text-white transition-colors duration-300">
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}
