import { Blog } from "@prisma/client";
import { fetchAuthor } from "@/app/page";
import Image from "next/image";
const fetchPost = async (id: string): Promise<Blog | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/posts/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch post", error);
    return null;
  }
};

const PostPage = async ({ params }: { params: { id: string } }) => {
  const post = await fetchPost(params.id);

  if (!post) {
    return <div className="text-center py-12">Post not found.</div>;
  }

  return (
    <div className="md:max-w-4xl max-w-full mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="flex gap-2">
        <p className="text-muted-foreground">By {fetchAuthor(post.authorId)}</p>
        <span className="text-muted-foreground">•</span>
        <p className="text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <Image
        src={post.coverImage || ""}
        alt={post.title}
        width={400}
        height={400}
        className="rounded-lg object-cover w-full h-[300px]"
      />
      <p className="text-muted-foreground">{post.content}</p>
    </div>
  );
};

export default PostPage;
