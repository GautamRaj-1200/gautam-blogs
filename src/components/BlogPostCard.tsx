import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripHtml } from "@/lib/utils";

interface BlogPostCardProps {
  post: {
    title: string;
    description: string;
    coverImage: string;
    tags: string[];
    date: string;
    author: string;
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
      <CardHeader className="p-0">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-2xl font-bold mb-2">{post.title}</CardTitle>
        <CardDescription className="text-muted-foreground mb-4">
          {stripHtml(post.description)}
        </CardDescription>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.date}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
