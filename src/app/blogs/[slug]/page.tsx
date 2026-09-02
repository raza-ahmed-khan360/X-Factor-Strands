import { notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { blogs } from "@/data/blogs";
import Link from "next/link";
import { Metadata } from "next";
import { Calendar, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) {
    return { title: "Blog Not Found" };
  }
  return {
    title: `${blog.title} | X-Factor Peptides`,
    description: blog.excerpt,
    openGraph: {
      title: `${blog.title} | X-Factor Peptides`,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.date,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.imageUrl ? [blog.imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "datePublished": blog.date,
    "image": blog.imageUrl ? `https://xfactorpeptides.com${blog.imageUrl}` : undefined,
    "author": {
      "@type": "Organization",
      "name": "X-Factor Peptides"
    },
    "publisher": {
      "@type": "Organization",
      "name": "X-Factor Peptides",
      "logo": {
        "@type": "ImageObject",
        "url": "https://xfactorpeptides.com/logo.png"
      }
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl md:text-3xl font-display font-bold mt-10 mb-4 text-foreground border-b border-border/40 pb-2">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-display font-semibold mt-6 mb-3 text-accent">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-6 list-disc mb-2 text-muted-foreground">{line.replace('* ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      return <p key={index} className="mb-4 text-muted-foreground leading-relaxed text-base md:text-lg">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="flex-grow pt-28 md:pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>

          <article>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-medium">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{blog.date}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground tracking-tight leading-tight">
              {blog.title}
            </h1>

            {blog.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-10 border border-border shadow-md">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  className="w-full h-auto max-h-[460px] object-cover" 
                />
              </div>
            )}

            <div className="bg-card/40 border border-border/60 rounded-xl p-6 md:p-8 mb-10 shadow-sm">
              <p className="text-lg md:text-xl text-foreground font-medium italic leading-relaxed">
                "{blog.excerpt}"
              </p>
            </div>

            <div className="prose prose-invert max-w-none text-foreground leading-relaxed">
              {renderContent(blog.content)}
            </div>

            <div className="mt-14 pt-8 border-t border-border flex justify-between items-center">
              <Link 
                href="/blogs" 
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Articles</span>
              </Link>
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
