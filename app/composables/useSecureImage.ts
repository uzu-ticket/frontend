import type { EventImage } from "~/types/event";

export interface SecureImageSource {
  id?: string;
  eventId?: string;
  url?: string;
  s3Key?: string | null;
}

export function isS3Source(urlOrKey?: string | null): boolean {
  if (!urlOrKey) return false;
  // Direct S3 paths
  if (urlOrKey.startsWith("organisations/") || urlOrKey.startsWith("events/")) {
    return true;
  }
  // S3 hostnames
  if (
    urlOrKey.includes(".amazonaws.com") ||
    urlOrKey.includes("uzu-ticket-bucket") ||
    urlOrKey.includes(".s3.")
  ) {
    return true;
  }
  return false;
}

export function extractS3Key(urlOrKey?: string | null): string | null {
  if (!urlOrKey) return null;
  if (!urlOrKey.startsWith("http://") && !urlOrKey.startsWith("https://")) {
    return urlOrKey.replace(/^\/+/, "");
  }
  try {
    const parsed = new URL(urlOrKey);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}

export const useSecureImage = () => {
  const { instance } = useApi();
  const { activeOrgId } = useOrgState();

  const cache = useNuxtApp().$signedUrlCache as Map<
    string,
    { url: string; expiresAt: number }
  > | null;

  /**
   * Resolves any image source (S3 key, S3 URL, EventImage object, or regular URL)
   * into a browser-loadable URL.
   *
   * - Local assets, blob URLs, and external non-S3 URLs are returned as-is immediately.
   * - Already-presigned URLs are returned as-is immediately.
   * - Private S3 assets are exchanged for a presigned GET URL and cached in-memory.
   */
  async function resolveSecureUrl(
    source?: string | EventImage | SecureImageSource | null,
    options?: { organisationId?: string },
  ): Promise<string | null> {
    if (!source) return null;

    let rawString = "";
    let eventId: string | undefined;
    let imageId: string | undefined;
    let s3Key: string | undefined;

    if (typeof source === "string") {
      rawString = source.trim();
    } else {
      rawString = (source.url || "").trim();
      s3Key = source.s3Key || undefined;
      eventId = source.eventId;
      imageId = source.id;
    }

    if (!rawString && !s3Key) return null;

    // 1. Data URLs and Blob URLs (e.g. client upload previews)
    if (rawString.startsWith("data:") || rawString.startsWith("blob:")) {
      return rawString;
    }

    // 2. Relative app assets (e.g. /uzu-logo.png, /event-live.png)
    if (rawString.startsWith("/") && !rawString.startsWith("//")) {
      return rawString;
    }

    // 3. Already presigned URLs
    if (rawString.includes("X-Amz-Signature") || rawString.includes("AWSAccessKeyId")) {
      return rawString;
    }

    // 4. Non-S3 external URLs (regular CDN or external images)
    if (
      (rawString.startsWith("http://") || rawString.startsWith("https://")) &&
      !isS3Source(rawString)
    ) {
      return rawString;
    }

    // 5. If we reach here, it's a private S3 object that requires presigning.
    const key = s3Key || extractS3Key(rawString) || undefined;
    const cacheKey = imageId || key || rawString;
    const now = Date.now();

    // Check in-memory cache first (valid if > 60s remaining)
    if (cache && cacheKey) {
      const hit = cache.get(cacheKey);
      if (hit && hit.expiresAt - 60_000 > now) {
        return hit.url;
      }
    }

    // Determine organisation ID:
    // 1. Explicit option passed by caller
    // 2. Extracted directly from the S3 path (events/:orgId/... or organisations/:orgId/...)
    // 3. Fallback to active organisation from session
    let orgId = options?.organisationId;
    if (!orgId && key) {
      const match = key.match(/^(?:organisations|events)\/([^/]+)\//);
      if (match) orgId = match[1];
    }
    if (!orgId) {
      orgId = activeOrgId.value;
    }

    if (!orgId) {
      // Cannot sign without org context; fall back to raw URL
      return rawString || null;
    }

    try {
      let signedUrl = "";
      let expiresAtStr = "";

      // Path A: EventImage route
      if (eventId && imageId) {
        const res = await instance.get<{ url: string; expiresAt: string }>(
          `/organisations/${orgId}/events/${eventId}/images/${imageId}/view`,
        );
        signedUrl = res.data.url;
        expiresAtStr = res.data.expiresAt;
      }
      // Path B: General organisation uploads view route
      else if (key) {
        const res = await instance.get<{ url: string; expiresAt: string }>(
          `/organisations/${orgId}/uploads/view`,
          {
            params: { key },
          },
        );
        signedUrl = res.data.url;
        expiresAtStr = res.data.expiresAt;
      }

      if (signedUrl) {
        if (cache && cacheKey) {
          cache.set(cacheKey, {
            url: signedUrl,
            expiresAt: new Date(expiresAtStr).getTime(),
          });
        }
        return signedUrl;
      }
    } catch (err) {
      console.warn("Failed to generate presigned GET viewing URL:", err);
    }

    // Fallback: return raw URL if signing failed
    return rawString || null;
  }

  return {
    isS3Source,
    extractS3Key,
    resolveSecureUrl,
  };
};
