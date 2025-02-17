/**
 * This is the client-side entrypoint for your tRPC API.
 * It's used to create the `api` object which contains the Next.js App-wrapper
 * as well as your typesafe react-query hooks.
 *
 * We also create a few inference helpers for input and output types
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { TRPCError } from "@trpc/server";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { MutationCache, QueryCache } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { type AppRouter } from "../server/api/root";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  if (process.env.HOST_URL) return `https://${process.env.HOST_URL}`; // SSR not on vercel should use HOST_URL (AWS)
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * A set of typesafe react-query hooks for your tRPC API
 */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server
       * @see https://trpc.io/docs/data-transformers
       **/
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server
       * @see https://trpc.io/docs/links
       * */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      abortOnUnmount: true,
      queryClientConfig: {
        // catch all query errors
        queryCache: new QueryCache({
          onError: (error: unknown) => {
            toast.error(`Error: ${(error as TRPCError).message}`, {
              duration: 4000,
            });
          },
        }),
        // catch all muatation errors
        mutationCache: new MutationCache({
          onError: (error: unknown) => {
            toast.error(`Error: ${(error as TRPCError).message}`, {
              duration: 4000,
            });
          },
        }),
      },
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
