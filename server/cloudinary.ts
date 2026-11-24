import { v2 as cloudinary } from 'cloudinary';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });
}

type SupportedImageExt = 'jpg' | 'png' | 'gif' | 'webp';

function detectSupportedImageExt(buf: Buffer): SupportedImageExt | null {
  if (buf.length < 12) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  // PNG: 89 50 4E 47
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return 'png';
  }
  // GIF: GIF8
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) {
    return 'gif';
  }
  // WEBP: RIFF....WEBP
  if (
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

export async function uploadImageAsset(
  buffer: Buffer,
  uploadsDir: string,
): Promise<{ url: string; publicId: string; storage: 'cloudinary' | 'local' }> {
  const ext = detectSupportedImageExt(buffer);
  if (!ext) {
    throw new Error('UNSUPPORTED_IMAGE_FILE');
  }

  if (!isCloudinaryConfigured()) {
    await fs.mkdir(uploadsDir, { recursive: true });
    const id = crypto.randomUUID();
    const filename = `${id}.${ext}`;
    const destination = path.join(uploadsDir, filename);
    await fs.writeFile(destination, buffer);
    return {
      url: `/uploads/${filename}`,
      publicId: `local/${filename}`,
      storage: 'local',
    };
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'volker-schnuettgen',
        resource_type: 'image',
      },
      (err, result) => {
        if (err || !result) {
          reject(err || new Error('Cloudinary upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          storage: 'cloudinary',
        });
      },
    );

    stream.end(buffer);
  });
}

