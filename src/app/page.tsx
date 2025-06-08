import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";

const mockPosts = [
  {
    coverPic:
      "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Mastering Next.js 14",
    description:
      "A deep dive into the latest features of Next.js 14 and how to use them effectively.",
    date: "October 26, 2023",
    author: "Gautam",
    tags: ["Next.js", "React", "Web Development"],
  },
  {
    coverPic:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "The Art of State Management",
    description:
      "Exploring different state management solutions in modern frontend applications.",
    date: "October 22, 2023",
    author: "Gautam",
    tags: ["State Management", "Zustand", "Redux"],
  },
  {
    coverPic:
      "https://images.unsplash.com/photo-1542831371-d531d36971ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Building a Retro-Themed Blog",
    description:
      "A step-by-step guide to creating a blog with a retro aesthetic using Tailwind CSS.",
    date: "October 18, 2023",
    author: "Gautam",
    tags: ["Tailwind CSS", "Design", "Tutorial"],
  },
  {
    coverPic:
      "https://images.unsplash.com/photo-1542831371-d531d36971ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Deploying to Vercel",
    description:
      "A complete guide to deploying your Next.js application to Vercel with ease.",
    date: "October 15, 2023",
    author: "Gautam",
    tags: ["Vercel", "Deployment", "CI/CD"],
  },
];

const Page = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-12">
        <h1 className="text-6xl font-bold tracking-tighter mb-2">
          Gautam Blogs
        </h1>
        <p className="text-lg text-muted-foreground">
          Your source for technical deep dives and tutorials.
        </p>
        <SignedIn>
          <Link
            href="/write"
            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Write a Post
          </Link>
        </SignedIn>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {mockPosts.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
