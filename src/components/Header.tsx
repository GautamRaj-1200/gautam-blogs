"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const Header = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // Only show the 'Back to Home' link on pages other than the home page.
  if (pathname === "/") {
    return null;
  }

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <header className="py-4">
      <div className="container mx-auto flex items-center gap-4">
        <Link
          href="/"
          onClick={handleClick}
          className="text-primary hover:underline"
        >
          &larr; Back to Home
        </Link>
        {isLoading && <LoadingSpinner />}
      </div>
    </header>
  );
};

export default Header;
