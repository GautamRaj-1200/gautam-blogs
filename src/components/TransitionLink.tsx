"use client";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  target?: string;
}

const TransitionLink = ({
  children,
  href,
  className,
  target,
}: TransitionLinkProps) => {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const body = document.querySelector("body");
    body?.classList.add("page-transition");

    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push(href);
  };

  return (
    <Link
      onClick={handleTransition}
      href={href}
      className={className}
      target={target}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
