import * as React from 'react';

export const productData = [
  {
    id: "mb-1",
    name: "Metabolic Research Complex MB-1",
    category: "Weight Management",
    price: "£29.99",
    shortDesc: "A research compound studied for its role in metabolic signalling pathways.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in lipolytic and metabolic pathways. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "1.2kDa" },
    iconColor: "#2F5FFF"
  },
  {
    id: "rc-2",
    name: "Recovery Research Blend RC-2",
    category: "Recovery",
    price: "£34.99",
    shortDesc: "Laboratory peptide investigated for cellular repair and regeneration research.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in tissue repair mechanisms and cellular regeneration. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">98.5%", format: "Lyophilised", storage: "-20°C", mw: "2.4kDa" },
    iconColor: "#22D3EE"
  },
  {
    id: "pf-3",
    name: "Performance Research Series PF-3",
    category: "Performance",
    price: "£32.99",
    shortDesc: "Research compound studied for physiological performance markers.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in muscular endurance and physiological performance markers. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "1.8kDa" },
    iconColor: "#0B5FFF"
  },
  {
    id: "sl-4",
    name: "Sleep Research Peptide SL-4",
    category: "Sleep",
    price: "£27.99",
    shortDesc: "Compound investigated for circadian rhythm and sleep architecture research.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in circadian rhythm regulation and deep sleep architecture. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99.2%", format: "Lyophilised", storage: "-20°C", mw: "1.5kDa" },
    iconColor: "#2F5FFF"
  },
  {
    id: "fc-5",
    name: "Focus Research Peptide FC-5",
    category: "Focus & Cognitive",
    price: "£31.99",
    shortDesc: "Research peptide studied for neurological cognitive function pathways.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in neurological pathways associated with cognitive function and focus. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">98%", format: "Lyophilised", storage: "-20°C", mw: "3.1kDa" },
    iconColor: "#22D3EE"
  },
  {
    id: "en-6",
    name: "Energy Research Complex EN-6",
    category: "Energy",
    price: "£29.99",
    shortDesc: "Compound explored for mitochondrial function and cellular energy research.",
    longDesc: "This compound is currently being studied in laboratory settings for its potential role in mitochondrial function and energy metabolism. As with all research peptides, this product is strictly for research purposes.",
    specs: { purity: ">99%", format: "Lyophilised", storage: "-20°C", mw: "2.1kDa" },
    iconColor: "#0B5FFF"
  }
];

export function AbstractMoleculeIcon({ color = "#22D3EE", className = "" }: { color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="30" r="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <circle cx="30" cy="65" r="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <circle cx="70" cy="65" r="10" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <path d="M45 35 L33 59" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
      <path d="M55 35 L66 57" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
      <path d="M37 65 L59 65" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}

export function ProductCard({ product }: { product: typeof productData[0] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 glow-hover group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 rounded-lg bg-background border border-border flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-accent/5" />
           <AbstractMoleculeIcon color={product.iconColor} className="w-10 h-10" />
        </div>
        <span className="text-lg font-display font-semibold text-foreground">{product.price}</span>
      </div>
      <div>
        <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-2">{product.category}</span>
        <h3 className="text-xl font-display font-semibold text-foreground leading-tight mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDesc}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-border/50">
        <button className="w-full py-2.5 rounded-md border border-secondary text-secondary font-medium text-sm hover:bg-secondary hover:text-white transition-colors duration-300">
          View Product
        </button>
      </div>
    </div>
  );
}
