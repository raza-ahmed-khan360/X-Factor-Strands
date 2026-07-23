const fs = require('fs');

const rawData = [
  { id: "semaglutide-glp1", name: "Semaglutide GLP1", variants: [ { size: "10mg", price: 50 }, { size: "20mg", price: 70 }, { size: "30mg", price: 90 } ] },
  { id: "tirzepatide-glp2", name: "Tirzepatide (Tirz) GLP2", variants: [ { size: "10mg", price: 60 }, { size: "20mg", price: 100 }, { size: "30mg", price: 120 } ] },
  { id: "retatrutide-glp3", name: "Retatrutide (Reta) GLP3", variants: [ { size: "10mg", price: 60 }, { size: "20mg", price: 100 }, { size: "30mg", price: 130 } ] },
  { id: "cagrilintide", name: "Cagrilintide", variants: [ { size: "10mg", price: 60 } ] },
  { id: "tesamorelin", name: "Tesamorelin (Tesa)", variants: [ { size: "10mg", price: 60 }, { size: "20mg", price: 100 } ] },
  { id: "mots-c", name: "MOTS-C", variants: [ { size: "10mg", price: 40 }, { size: "40mg", price: 80 } ] },
  { id: "sermorelin", name: "Sermorelin", variants: [ { size: "10mg", price: 60 } ] },
  { id: "bpc157", name: "BPC-157", variants: [ { size: "10mg", price: 50 } ] },
  { id: "tb-500", name: "TB-500", variants: [ { size: "5mg", price: 60 } ] },
  { id: "bpc157-tb500-wolverine", name: "BPC-157 / TB-500 Wolverine", variants: [ { size: "10mg/10mg", price: 80 } ] },
  { id: "klow", name: "KLOW", variants: [ { size: "80mg", price: 80 } ] },
  { id: "ipamorelin", name: "Ipamorelin", variants: [ { size: "10mg", price: 50 } ] },
  { id: "cjc-1295-ipa", name: "CJC-1295 / Ipamorelin", variants: [ { size: "5mg/5mg", price: 60 } ] },
  { id: "cjc-1295-w-dac", name: "CJC-1295 w/ DAC", variants: [ { size: "5mg", price: 70 } ] },
  { id: "cjc-1295-wo-dac", name: "CJC-1295 w/o DAC", variants: [ { size: "10mg", price: 60 } ] },
  { id: "igf-1-lr3", name: "IGF-1 LR3", variants: [ { size: "1mg", price: 60 } ] },
  { id: "hgh-191-aa", name: "HGH 191 AA", variants: [ { size: "15iu", price: 60 } ] },
  { id: "ghk-cu", name: "GHK-CU", variants: [ { size: "100mg", price: 60 } ] },
  { id: "nad-plus", name: "NAD+", variants: [ { size: "500mg", price: 50 } ] },
  { id: "kpv", name: "KPV", variants: [ { size: "10mg", price: 50 } ] },
  { id: "5-amino-1mq", name: "5 Amino 1MQ", variants: [ { size: "10mg", price: 80 } ] },
  { id: "aod-9604", name: "AOD-9604", variants: [ { size: "10mg", price: 100 } ] },
  { id: "ara-290", name: "ARA-290", variants: [ { size: "10mg", price: 50 }, { size: "16mg", price: 80 } ] },
  { id: "ss-31", name: "SS-31", variants: [ { size: "10mg", price: 60 } ] },
  { id: "epithalon", name: "Epithalon", variants: [ { size: "10mg", price: 40 } ] },
  { id: "pt-141", name: "PT-141", variants: [ { size: "10mg", price: 40 } ] },
  { id: "dsip", name: "DSIP", variants: [ { size: "5mg", price: 40 } ] },
  { id: "melanotan-2", name: "Melanotan 2", variants: [ { size: "10mg", price: 50 } ] },
  { id: "lipo-c", name: "Lipo-C", variants: [ { size: "10mg", price: 30 } ] },
  { id: "bac-water", name: "BAC Water", variants: [ { size: "3mL", price: 5 }, { size: "5mL", price: 8 }, { size: "10mL", price: 12 } ] }
];

const mappedData = rawData.map(item => {
  return `{
    id: "${item.id}",
    name: "${item.name}",
    category: "Research Peptide",
    shortDesc: "High-quality research compound for laboratory use.",
    longDesc: "This compound is strictly for research and laboratory purposes. Please ensure proper handling and storage.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "Varies" },
    imageUrl: "/new-products/${item.id}.jpeg",
    reviews: { rating: 5.0, count: Math.floor(Math.random() * 50) + 10 },
    variants: ${JSON.stringify(item.variants)}
  }`;
});

const fileContent = `import * as React from 'react';
import { Star } from 'lucide-react';

export interface ProductVariant {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  specs: { purity: string; format: string; storage: string; mw: string };
  imageUrl: string;
  reviews: { rating: number; count: number };
  variants: ProductVariant[];
}

export const productData: Product[] = [
  ${mappedData.join(',\n  ')}
];

export function ProductCard({ product }: { product: Product }) {
  const startingPrice = product.variants[0].price;
  
  return (
    <div className="bg-card border border-border rounded-xl flex flex-col glow-hover group relative overflow-hidden p-0 h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      
      {/* Image Container - Full width top */}
      <div className="w-full h-56 bg-white relative overflow-hidden shrink-0 border-b border-border flex items-center justify-center p-4">
         <img 
           src={product.imageUrl} 
           alt={product.name} 
           className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
         />
         <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm z-10">
           <span className="text-sm font-display font-bold text-foreground">From $\${startingPrice.toFixed(2)}</span>
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
`;

fs.writeFileSync('D:\\MAK-solutions\\x-factor\\artifacts\\xfactor-peptides\\src\\components\\products\\ProductData.tsx', fileContent);
console.log('ProductData.tsx generated!');
