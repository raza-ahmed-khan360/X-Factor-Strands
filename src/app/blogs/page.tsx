import Link from "next/link";
import { blogs } from "@/data/blogs";
import { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Articles & Blogs | X-Factor Peptides",
  description: "Explore the latest peptide research, science-backed guides, and laboratory insights from X-Factor Peptides.",
  openGraph: {
    title: "Research Articles & Blogs | X-Factor Peptides",
    description: "Explore the latest peptide research, science-backed guides, and laboratory insights from X-Factor Peptides.",
    type: "website",
  },
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/20">
      <Header />
      
      {/* Top spacing that cleanly clears the fixed header (banner + navbar) */}
      <main className="flex-grow pt-28 md:pt-32 pb-20">
        {/* Header Block with background and border matching other pages */}
        <div className="bg-card/50 border-b border-border py-12 md:py-16 mb-12">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4 border border-accent/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Research & Education</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight text-foreground">
              Articles & Science Blogs
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Stay informed with in-depth analysis on peptide science, research methodologies, and clinical study breakdowns.
            </p>
          </div>
        </div>

        {/* Blogs List */}
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog.id} 
                className="group bg-card rounded-xl border border-border hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
              >
                {blog.imageUrl && (
                  <div className="md:w-2/5 shrink-0 relative overflow-hidden bg-muted aspect-video md:aspect-auto">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>{blog.date}</span>
                    </div>
                    <Link href={`/blogs/${blog.slug}`} className="block">
                      <h2 className="text-xl md:text-2xl font-display font-semibold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div>
                    <Link 
                      href={`/blogs/${blog.slug}`} 
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform"
                    >
                      Read Full Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
