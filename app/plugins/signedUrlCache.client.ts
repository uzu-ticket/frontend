/**
 * Provides a lightweight in-memory cache for presigned S3 GET URLs, shared
 * across the entire app via the Nuxt plugin system.
 *
 * SecureEventImage reads from `$signedUrlCache` to avoid re-fetching a
 * presigned URL that is still valid.
 */
export default defineNuxtPlugin(() => {
  const cache = new Map<string, { url: string; expiresAt: number }>();

  return {
    provide: {
      signedUrlCache: cache,
    },
  };
});
