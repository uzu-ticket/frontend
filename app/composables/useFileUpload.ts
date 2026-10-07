/**
 * useFileUpload — reusable presigned-URL upload composable.
 *
 * Flow:
 *  1. POST /presign  → get { uploadUrl, fileUrl }
 *  2. PUT uploadUrl  → send file binary directly to S3 (bypasses NestJS)
 *  3. Return fileUrl  → caller saves it to the relevant entity
 */

export interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export const useFileUpload = () => {
  const { instance } = useApi();

  const uploadProgress = ref<UploadProgress | null>(null);
  const uploading = ref(false);
  const uploadError = ref<string | null>(null);

  /**
   * Upload a File using a presigned URL obtained from the given presign endpoint.
   *
   * @param presignEndpoint  - Backend route to POST to (e.g. `/organisations/xxx/uploads/presign`)
   * @param file             - The File object to upload
   * @param assetType        - The asset slot (e.g. "logo", "cover", "gallery")
   * @returns The permanent public URL of the uploaded file
   */
  const uploadFile = async (
    presignEndpoint: string,
    file: File,
    assetType: string,
  ): Promise<string> => {
    uploading.value = true;
    uploadError.value = null;
    uploadProgress.value = null;

    try {
      // Step 1: Request a presigned PUT URL from the backend
      const presignRes = await instance.post<PresignResponse>(presignEndpoint, {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        assetType,
      });

      const { uploadUrl, fileUrl } = presignRes.data;

      // Step 2: PUT file binary directly to S3 — no multipart, no proxy
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            uploadProgress.value = {
              loaded: event.loaded,
              total: event.total,
              percent: Math.round((event.loaded / event.total) * 100),
            };
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 upload failed: HTTP ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("S3 upload network error")));
        xhr.addEventListener("abort", () => reject(new Error("S3 upload aborted")));

        xhr.send(file);
      });

      // Step 3: Return the permanent public URL — caller saves it to the entity
      return fileUrl;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      uploadError.value = msg;
      throw e;
    } finally {
      uploading.value = false;
    }
  };

  /** Reset state between uploads */
  const resetUpload = () => {
    uploading.value = false;
    uploadError.value = null;
    uploadProgress.value = null;
  };

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadFile,
    resetUpload,
  };
};
