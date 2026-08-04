import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface StrandProps {
  sections: { id: string; label: string }[];
}

export function TheStrand({ sections }: StrandProps) {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set(['Hero']));
  const [lineHeight, setLineHeight] = useState(0);
  const [strandOpacity, setStrandOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate how far down the page we've scrolled relative to the document
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const documentH = document.body.scrollHeight;
      
      const newActive = new Set<string>();
      let lowestActiveY = 0;
      
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const elRect = el.getBoundingClientRect();
          // If the section top is above the middle of the viewport
          if (elRect.top < windowH * 0.6) {
            newActive.add(section.label);
          }
        }
      });
      
      // Fade out when within 600px of the bottom (approx footer area)
      const distanceToBottom = documentH - (scrollY + windowH);
      if (distanceToBottom < 600) {
        setStrandOpacity(Math.max(0, distanceToBottom / 600));
      } else {
        setStrandOpacity(1);
      }

      // Calculate line height based on active nodes
      // To keep it simple, we just draw down to the current scroll position + offset
      const drawHeight = Math.min(
        Math.max(0, scrollY - 100), 
        document.body.scrollHeight - windowH + 400
      );
      
      setActiveNodes((prev) => {
        if (prev.size !== newActive.size) {
          return newActive.size > 0 ? newActive : new Set(['Hero']);
        }
        return prev;
      });
      setLineHeight(drawHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div 
      ref={containerRef}
      className="hidden md:block fixed left-8 lg:left-16 top-0 bottom-0 w-32 z-40 pointer-events-none transition-opacity duration-100"
      style={{ opacity: strandOpacity }}
    >
      {/* The Line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-border/40" />
      <div 
        className="absolute left-[11px] top-0 w-[2px] bg-accent shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-700 ease-out origin-top"
        style={{ 
          height: `${lineHeight}px`,
          maxHeight: '100vh',
          transform: `translateY(${Math.max(0, 0)}px)`
        }} 
      />

      {/* The Nodes */}
      <div className="absolute left-0 top-0 bottom-0 w-full h-full flex flex-col justify-between py-[20vh]">
        {sections.map((section, idx) => {
          const isActive = activeNodes.has(section.label);
          // Distribute nodes evenly just for visual representation in the fixed sidebar
          return (
            <div 
              key={section.id} 
              className="flex items-center gap-4 transition-all duration-500"
              style={{
                opacity: isActive ? 1 : 0.3,
                transform: isActive ? 'translateX(0)' : 'translateX(-5px)'
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-accent/20" : "bg-transparent"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500",
                    isActive ? "bg-accent shadow-[0_0_12px_rgba(34,211,238,1)]" : "bg-muted-foreground/30"
                  )} />
                </div>
              </div>
              <span className={cn(
                "font-display text-xs uppercase tracking-widest transition-colors duration-500",
                isActive ? "text-accent font-semibold" : "text-muted-foreground"
              )}>
                {section.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
