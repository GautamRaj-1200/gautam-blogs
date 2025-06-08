"use client";

import React, { useState } from "react";
import Image from "next/image";

const WritePage = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [tagsError, setTagsError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTags(value);

    //- Allow empty input
    if (value.trim() === "") {
      setTagsError(null);
      return;
    }

    //- Validation for comma-separated tags
    const tagsArray = value.split(",").map((tag) => tag.trim());
    if (tagsArray.some((tag) => tag === "")) {
      setTagsError(
        "Tags cannot be empty. Please provide a valid, comma-separated list."
      );
    } else {
      setTagsError(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Write a new blog post</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
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
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>
        {coverPreview && (
          <div className="mb-4">
            <Image
              src={coverPreview}
              alt="Cover image preview"
              width={400}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="content" className="block text-lg font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={15}
            className="w-full p-2 border rounded bg-background"
          ></textarea>
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
            className="w-full p-2 border rounded bg-background"
          />
          {tagsError && (
            <p className="text-red-500 text-sm mt-1">{tagsError}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default WritePage;
