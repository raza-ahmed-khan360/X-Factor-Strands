import { notFound } from "next/navigation";
import { blogs } from "@/data/blogs";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) {
    return { title: "Blog Not Found" };
  }
  return {
    title: blog.title,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  // A simple markdown-like renderer for the content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-6 list-disc mb-2">{line.replace('* ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{line}</p>;
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Link href="/blogs" className="text-accent hover:underline mb-8 inline-block">
        ← Back to Blogs
      </Link>
      <article className="prose prose-invert max-w-none">
        {blog.imageUrl && (
          <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-lg mb-8 shadow-md" />
        )}
        <h1 className="text-4xl font-display font-bold mb-4 text-foreground">{blog.title}</h1>
        <p className="text-muted-foreground mb-8">{blog.date}</p>
        <div className="text-foreground leading-relaxed">
          {renderContent(blog.content)}
        </div>
      </article>
    </div>
  );
}
