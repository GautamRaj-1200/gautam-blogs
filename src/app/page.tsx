import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import BlogPostCard from "@/components/BlogPostCard";
import Footer from "@/components/Footer";
import type { Blog } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

const fetchPosts = async (): Promise<Blog[]> => {
  const response = await fetch("http://localhost:3000/api/v1/posts", {
    cache: "no-store",
  });
  const data = await response.json();
  return data;
};

export const fetchAuthor = async (userId: string) => {
  const clerk = await clerkClient();
  const response = await clerk.users.getUser(userId);
  console.log(response);
  return response.firstName || "Unknown Author";
};

const Page = async () => {
  const posts = await fetchPosts();
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
        {posts.map(async (post) => {
          const postForCard = {
            id: post.id,
            title: post.title,
            description: post.content.substring(0, 150) + "...",
            coverImage:
              post.coverImage ||
              "https://images.unsplash.com/photo-1542831371-d531d36971ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&id=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            tags: post.tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t.length > 0),
            author: await fetchAuthor(post.authorId),
            date: new Date(post.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          };

          return (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <BlogPostCard key={post.id} post={postForCard} />{" "}
            </Link>
          );
        })}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
