import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadImage(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `geekon/${folder}`, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload falló"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// Se usa para no dejar huérfanas en Cloudinary las fotos que se rechazan,
// se borran individualmente o cuyo álbum se elimina. No falla si el
// public_id ya no existe (destroy es idempotente).
export function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) console.error("[cloudinary] no se pudo borrar", publicId, error);
      resolve();
    });
  });
}
