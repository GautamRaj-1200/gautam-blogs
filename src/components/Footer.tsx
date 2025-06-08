import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-gray-800">
      <div className="container mx-auto flex justify-between items-center text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Gautam Blogs. All Rights Reserved.
        </p>
        <div>
          <SignedOut>
            <div className="cursor-pointer">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
