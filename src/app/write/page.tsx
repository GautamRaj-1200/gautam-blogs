"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import WysiwygEditor from "@/components/WysiwygEditor";
const WritePage = () => {
  const { userId } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTags(value);

    if (value.trim() === "") {
      setTagsError(null);
      return;
    }

    const tagsArray = value.split(",").map((tag) => tag.trim());
    if (tagsArray.some((tag) => tag === "")) {
      setTagsError(
        "Tags cannot be empty. Please provide a valid, comma-separated list."
      );
    } else {
      setTagsError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (tagsError || !userId) {
      //- Optionally, add more validation feedback here
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          coverImage,
          tags,
          authorId: userId,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        //- Handle error response
        console.error("Failed to publish post");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-4">Write a new blog post</h1> */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded bg-background"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="coverImage"
            className="block text-lg font-medium mb-2"
          >
            Cover Image URL
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full p-2 border rounded bg-background"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-lg font-medium mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tags}
            onChange={handleTagsChange}
            required
            className="w-full p-2 border rounded bg-background"
          />
          {tagsError && (
            <p className="text-red-500 text-sm mt-1">{tagsError}</p>
          )}
        </div>
        <div className="mb-4">
          {/* <label htmlFor="content" className="block text-lg font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={15}
            className="w-full p-2 border rounded bg-background"
          ></textarea> */}
          <WysiwygEditor setContent={setContent} />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !!tagsError}
          className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:bg-gray-500"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
