import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HoverAccordionProps {
  question: string;
  answer: React.ReactNode;
}

export function HoverAccordion({ question, answer }: HoverAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group bg-background border border-border rounded-lg overflow-hidden"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={cn(
        "flex items-center justify-between cursor-pointer p-6 font-display font-medium text-lg list-none transition-all",
        isOpen ? "border-l-4 border-l-accent" : "border-l-4 border-l-transparent"
      )}>
        {question}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 pt-0 text-muted-foreground border-l-4 border-l-accent bg-background">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
