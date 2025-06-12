import { Blog } from "@prisma/client";
// import { fetchAuthor } from "@/app/page";
import { Josefin_Sans } from "next/font/google";

const josefinSans = Josefin_Sans({ subsets: ["latin"], weight: "400" });

import Image from "next/image";
const fetchPost = async (id: string): Promise<Blog | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch post", error);
    return null;
  }
};

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return <div className="text-center py-12">Post not found.</div>;
  }

  return (
    <div className="md:max-w-4xl max-w-full mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="flex gap-2">
        <p className="text-muted-foreground">By Gautam</p>
        <span className="text-muted-foreground">•</span>
        <p className="text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={400}
          height={400}
          className="rounded-lg object-cover w-full h-[300px]"
        />
      )}
      <div
        className={`prose ${josefinSans.className}`}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostPage;
