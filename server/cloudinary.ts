import { v2 as cloudinary } from 'cloudinary';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const CLOUDINARY_FOLDER = 'volker-schnuettgen';
export const CLOUDINARY_ALLOWED_FORMATS = 'jpg,jpeg,png,webp,gif';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

export interface CloudinaryUploadSignature {
  signature: string;
  timestamp: number;
  folder: string;
  allowed_formats: string;
  maxFileSizeBytes: number;
  api_key: string;
  cloud_name: string;
}

/**
 * Generates a signed payload for direct browser-to-Cloudinary upload,
 * avoiding Vercel Function's 4.5 MB request body ceiling and eliminating all disk writes.
 * Never exposes CLOUDINARY_API_SECRET.
 */
export function createSignedCloudinaryUpload(): CloudinaryUploadSignature {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    allowed_formats: CLOUDINARY_ALLOWED_FORMATS,
    folder: CLOUDINARY_FOLDER,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    folder: CLOUDINARY_FOLDER,
    allowed_formats: CLOUDINARY_ALLOWED_FORMATS,
    maxFileSizeBytes: MAX_UPLOAD_BYTES,
    api_key: apiKey,
    cloud_name: cloudName,
  };
}

/**
 * Verifies that an uploaded URL belongs strictly to the configured Cloudinary cloud name
 * and points to an image upload delivery path.
 */
export function isTrustedCloudinaryUrl(rawUrl: string): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) return false;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') return false;
    if (parsed.hostname !== 'res.cloudinary.com') return false;
    if (parsed.pathname.includes('..')) return false;
    return parsed.pathname.startsWith(`/${cloudName}/image/upload/`);
  } catch {
    return false;
  }
}

/**
 * Uploads an image Buffer directly to Cloudinary using a deterministic public_id
 * under volker-schnuettgen/migrated so repeated migration clicks remain idempotent.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  publicIdSlug: string,
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const safeSlug = publicIdSlug
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120);

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${CLOUDINARY_FOLDER}/migrated`,
        public_id: safeSlug || 'asset',
        overwrite: false,
        unique_filename: false,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
