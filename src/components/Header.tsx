"use client";

import TransitionLink from "./TransitionLink";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  // Only show the 'Back to Home' link on pages other than the home page.
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="py-4">
      <div className="container mx-auto flex items-center gap-4">
        <TransitionLink href="/" className="text-primary hover:underline">
          &larr; Back to Home
        </TransitionLink>
      </div>
    </header>
  );
};

export default Header;
