import React, { useRef, useState } from "react";

const WysiwygEditor = ({
  setContent,
}: {
  setContent: (content: string) => void;
}) => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptConfig, setPromptConfig] = useState<{
    tagName: string;
    placeholder: string;
    transformFn: ((el: HTMLElement, value: string) => void) | null;
  }>({
    tagName: "",
    placeholder: "",
    transformFn: null,
  });
  const [promptValue, setPromptValue] = useState("");
  const [isOkDisabled, setIsOkDisabled] = useState(true);

  const format = (formatOption: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!textContainerRef.current?.contains(range.commonAncestorContainer))
      return;

    if (formatOption === "B") {
      const strong = document.createElement("strong");
      strong.appendChild(range.extractContents());
      range.insertNode(strong);
    } else if (formatOption === "I") {
      const em = document.createElement("em");
      em.appendChild(range.extractContents());
      range.insertNode(em);
    } else if (formatOption === "U") {
      const underline = document.createElement("u");
      underline.appendChild(range.extractContents());
      range.insertNode(underline);
    } else if (formatOption === "HL") {
      // Highlight logic would go here
    }
  };

  const handlePromptAndInsert = (
    tagName: string,
    placeholderText: string,
    transformFn: ((el: HTMLElement, value: string) => void) | null = null
  ) => {
    if (tagName === "hr") {
      const hr = document.createElement("hr");
      hr.className = "my-4 border-gray-600";
      textContainerRef.current?.appendChild(hr);
      return;
    }
    setPromptConfig({ tagName, placeholder: placeholderText, transformFn });
    setShowPrompt(true);
    setPromptValue("");
    setIsOkDisabled(true);
  };

  const handlePromptOk = () => {
    const { tagName, transformFn } = promptConfig;
    const division = document.createElement("div");
    division.className = "flex justify-between items-center gap-2 mb-2";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Del";
    deleteBtn.className =
      "px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-md";
    deleteBtn.onclick = () => division.remove();

    const el = document.createElement(tagName);
    if (tagName === "h1") {
      el.className = "text-4xl font-bold my-5";
    } else if (tagName === "h2") {
      el.className = "text-3xl font-bold my-4";
    } else if (tagName === "h3") {
      el.className = "text-2xl font-bold my-2";
    } else if (tagName === "p") {
      el.className = "text-xl leading-8 my-2";
    } else if (tagName === "ul") {
      el.className = "text-xl list-disc leading-7 my-2";
    } else if (tagName === "ol") {
      el.className = "text-xl list-decimal leading-7 my-2";
    } else if (tagName === "pre") {
      el.className =
        "bg-gray-900 text-gray-400 p-2.5 rounded whitespace-pre-wrap text-lg block";
    }
    if (transformFn) {
      transformFn(el, promptValue);
    } else {
      el.textContent = promptValue;
    }

    el.contentEditable = "true";
    division.appendChild(el);
    division.appendChild(deleteBtn);
    textContainerRef.current?.appendChild(division);

    setShowPrompt(false);
    setPromptValue("");
  };

  const handlePromptCancel = () => {
    setShowPrompt(false);
    setPromptValue("");
  };

  const handlePromptInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPromptValue(e.target.value);
    setIsOkDisabled(e.target.value.trim() === "");
  };

  const handleImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) {
        if (fileInput.parentNode) {
          document.body.removeChild(fileInput);
        }
        return;
      }

      const placeholderId = `upload-${Date.now()}`;
      const placeholder = document.createElement("div");
      placeholder.id = placeholderId;
      placeholder.textContent = "Uploading image...";
      placeholder.className =
        "text-gray-400 italic p-2 bg-gray-700 rounded-md animate-pulse";
      textContainerRef.current?.appendChild(placeholder);

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

        const currentPlaceholder = document.getElementById(placeholderId);
        if (!currentPlaceholder) return;

        const division = document.createElement("div");
        division.className = "flex justify-between items-start gap-2 mb-2";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Del";
        deleteBtn.className =
          "px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-md flex-shrink-0";
        deleteBtn.onclick = () => division.remove();

        const img = document.createElement("img");
        img.src = publicUrl;
        img.alt = file.name;
        img.className = "max-w-full rounded-md";

        division.appendChild(img);
        division.appendChild(deleteBtn);

        currentPlaceholder.replaceWith(division);
      } catch (error) {
        console.error("Image upload failed:", error);
        const failedPlaceholder = document.getElementById(placeholderId);
        if (failedPlaceholder) {
          failedPlaceholder.textContent =
            "Image upload failed. Please try again.";
          failedPlaceholder.className = "text-red-500 italic p-2";
          setTimeout(() => {
            failedPlaceholder.remove();
          }, 3000);
        }
      } finally {
        if (fileInput.parentNode) {
          document.body.removeChild(fileInput);
        }
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleSave = async () => {
    if (textContainerRef.current) {
      const clonedNode = textContainerRef.current.cloneNode(
        true
      ) as HTMLElement;

      clonedNode.querySelectorAll("div").forEach((element) => {
        (element as HTMLElement).removeAttribute("class");
      });
      clonedNode
        .querySelectorAll("[contentEditable=true]")
        .forEach((element) => {
          (element as HTMLElement).contentEditable = "false";
        });
      clonedNode.querySelectorAll("button").forEach((element) => {
        (element as HTMLButtonElement).remove();
      });

      const editorData = {
        content: clonedNode.innerHTML,
      };

      setContent(editorData.content);
      console.log(editorData.content);
    }
  };

  const handleClear = () => {
    if (textContainerRef.current) {
      textContainerRef.current.innerHTML = "";
    }
  };

  const baseButtonClass =
    "px-4 py-2 cursor-pointer bg-gray-700 hover:bg-gray-600 font-bold text-gray-200 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center p-4 w-full top-0 bg-gray-800 z-10">
        <button
          type="button"
          className={baseButtonClass}
          onClick={() => handlePromptAndInsert("h1", "Enter heading 1...")}
        >
          H1
        </button>
        <button
          type="button"
          className={baseButtonClass}
          onClick={() => handlePromptAndInsert("h2", "Enter heading 2...")}
        >
          H2
        </button>
        <button
          type="button"
          className={baseButtonClass}
          onClick={() => handlePromptAndInsert("h3", "Enter heading 3...")}
        >
          H3
        </button>

        <button
          type="button"
          className={baseButtonClass}
          onClick={() => handlePromptAndInsert("p", "Enter paragraph...")}
        >
          P
        </button>

        <button
          type="button"
          className={baseButtonClass}
          onClick={() =>
            handlePromptAndInsert(
              "ol",
              "Enter comma-separated list items...",
              (el, value) => {
                const items = value.split(",").map((item) => item.trim());
                items.forEach((text) => {
                  const li = document.createElement("li");
                  li.textContent = text;
                  el.appendChild(li);
                });
              }
            )
          }
        >
          List
        </button>
        <button
          type="button"
          className={baseButtonClass}
          onClick={() =>
            handlePromptAndInsert(
              "ul",
              "Enter comma-separated list items...",
              (el, value) => {
                const items = value.split(",").map((item) => item.trim());
                items.forEach((text) => {
                  const li = document.createElement("li");
                  li.textContent = text;
                  el.appendChild(li);
                });
              }
            )
          }
        >
          Numbered
        </button>

        <button
          type="button"
          className={baseButtonClass}
          onClick={() => handlePromptAndInsert("hr", "")}
        >
          Rule
        </button>

        <button
          type="button"
          className={baseButtonClass}
          onClick={() =>
            handlePromptAndInsert("pre", "Enter code...", (el, value) => {
              const code = document.createElement("code");
              code.textContent = value;
              el.appendChild(code);
              el.className =
                "bg-gray-900 text-gray-400 p-2.5 rounded whitespace-pre-wrap text-lg block";
            })
          }
        >
          Code
        </button>

        <button
          type="button"
          className={baseButtonClass}
          onClick={handleImageUpload}
        >
          Image
        </button>

        <button
          type="button"
          className={baseButtonClass}
          onClick={() => format("B")}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={baseButtonClass}
          onClick={() => format("I")}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={baseButtonClass}
          onClick={() => format("U")}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          className={baseButtonClass}
          onClick={() => format("HL")}
        >
          <span>HL</span>
        </button>

        <button
          type="button"
          className={`${baseButtonClass} bg-red-600 hover:bg-red-700`}
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      <div
        className="border border-white min-h-[400px] mt-6 mb-5 mx-auto p-8 text-white flex flex-col gap-2 bg-gray-800 overflow-y-auto"
        ref={textContainerRef}
      >
        {/* Content will be appended here */}
      </div>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-50">
          <textarea
            className="bg-gray-900 text-white text-lg border border-primary focus:outline-none p-2 min-h-[100px] w-4/5 mb-2.5 rounded-md"
            placeholder={promptConfig.placeholder}
            value={promptValue}
            onChange={handlePromptInputChange}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={`${baseButtonClass} bg-green-600 hover:bg-green-700`}
              onClick={handlePromptOk}
              disabled={isOkDisabled}
            >
              OK
            </button>
            <button
              type="button"
              className={`${baseButtonClass} bg-red-600 hover:bg-red-700`}
              onClick={handlePromptCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`${baseButtonClass} block mx-auto my-5 bg-green-600 hover:bg-green-700`}
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default WysiwygEditor;
