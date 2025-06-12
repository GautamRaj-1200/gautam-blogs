"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import WysiwygEditor from "@/components/WysiwygEditor";
import Image from "next/image";
const WritePage = () => {
  const { userId } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleCoverImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const getSignedUrlResponse = await fetch("/api/uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!getSignedUrlResponse.ok) {
          throw new Error("Failed to get signed URL.");
        }

        const { signedUrl, publicUrl } = await getSignedUrlResponse.json();

        const uploadToS3Response = await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadToS3Response.ok) {
          throw new Error("Failed to upload image to S3.");
        }

        setCoverImage(publicUrl);
      } catch (error) {
        console.error("Cover image upload failed:", error);
      } finally {
        setIsUploading(false);
        document.body.removeChild(fileInput);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (tagsError) {
      setFormError(tagsError);
      return;
    }
    if (!userId) {
      setFormError("You must be signed in to publish a post.");
      return;
    }
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setFormError(
        "Content is empty. Please add content and click the 'Save' button in the editor before publishing."
      );
      return;
    }
    if (!tags.trim()) {
      setFormError("Please add at least one tag.");
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
            Cover Image
          </label>
          <button
            type="button"
            onClick={handleCoverImageUpload}
            disabled={isUploading}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80 disabled:bg-gray-500"
          >
            {isUploading ? "Uploading..." : "Upload Cover Image"}
          </button>
          {coverImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Cover Image Preview:</p>
              <Image
                src={coverImage}
                alt="Cover preview"
                width={400}
                height={400}
                className="max-w-sm rounded-md border border-gray-600"
              />
            </div>
          )}
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
          <WysiwygEditor setContent={setContent} />
        </div>
        {formError && (
          <p className="text-red-500 text-center mb-4">{formError}</p>
        )}
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
