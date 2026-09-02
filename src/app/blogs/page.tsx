import Link from "next/link";
import { blogs } from "@/data/blogs";
import { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Read the latest blogs and articles from X-Factor Peptides.",
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-accent/20">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-display font-bold mb-8 text-foreground">Blogs</h1>
      <div className="space-y-8">
        {blogs.map((blog) => (
          <article key={blog.id} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
            {blog.imageUrl && (
              <div className="md:w-1/3 shrink-0">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover aspect-video md:aspect-square" />
              </div>
            )}
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
            <Link href={`/blogs/${blog.slug}`} className="block group">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">{blog.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{blog.date}</p>
              <p className="text-muted-foreground">{blog.excerpt}</p>
              <span className="inline-block mt-4 text-accent font-medium group-hover:underline">Read more →</span>
            </Link>
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
