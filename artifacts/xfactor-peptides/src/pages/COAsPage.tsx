import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { FileText, Download, Eye } from 'lucide-react';

export default function COAsPage() {
  const coas = [
    { title: "5-Amino 1MQ", file: "5-Amino 1MQ.pdf" },
    { title: "AOD-9604 5mg", file: "AOD-9604 5mg.pdf" },
    { title: "ARA-290 10mg", file: "ARA-290 10mg (1).pdf" },
    { title: "BPC-157 TB-500 10mg", file: "BPC-157 TB-500 10mg.pdf" },
    { title: "DSIP 15mg", file: "DSIP 15mg.pdf" },
    { title: "KPV", file: "KPV COA-CN.pdf" },
    { title: "MT-2 10mg", file: "MT-2 10mg (2).pdf" },
    { title: "Retatrutide", file: "Retatrutide-1.pdf" },
    { title: "Sermorelin 10mg", file: "Sermorelin 10mg.pdf" },
    { title: "Tesamorelin 20mg", file: "Tesamorelin 20mg.pdf" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-16 mt-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Certificates of Analysis (COA)</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Confidence backed by independent testing. Verified Purity with Every Batch.
              Each product includes a detailed Certificate of Analysis (COA) from an independent third-party laboratory.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coas.map((coa, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-accent transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(11,95,255,0.1)] group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-6 flex-grow">{coa.title}</h3>
                
                <div className="flex gap-3 w-full">
                  <a 
                    href={`/docs/${encodeURIComponent(coa.file)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-secondary text-secondary py-2 rounded-md hover:bg-secondary/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </a>
                  <a 
                    href={`/docs/${encodeURIComponent(coa.file)}`} 
                    download
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
