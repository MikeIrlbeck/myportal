import { Twitter } from "@styled-icons/bootstrap/Twitter";
import { signIn } from "next-auth/react";

const TwitterButton = () => {
  return (
    <button
      className="relative inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-gray-700 hover:text-gray-100"
      type="button"
      onClick={() => void signIn("twitter", { callbackUrl: "/projects" })}
    >
      <span className="flex items-center">
        <span className="sr-only">Sign in with</span>
        <Twitter className="mr-2 h-6 w-6" />
        <span>Twitter</span>
      </span>
    </button>
  );
};

export default TwitterButton;
