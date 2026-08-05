import { prepareClientUploadImage, CLIENT_MAX_EDGE } from "@/lib/prepare-client-upload-image";

export { VERCEL_SAFE_UPLOAD_BYTES, shouldShrinkBeforeUpload } from "@/lib/prepare-client-upload-image";

export const ARCHIVE_CLIENT_MAX_EDGE = CLIENT_MAX_EDGE.archive;

export async function prepareArchiveUploadFile(file: File): Promise<File> {
  return prepareClientUploadImage(file, CLIENT_MAX_EDGE.archive, "archive-image");
}
