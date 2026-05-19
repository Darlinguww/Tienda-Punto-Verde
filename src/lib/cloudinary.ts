export function cloudinaryWebP(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const transforms = ['f_webp', 'q_auto', ...(width ? [`w_${width}`] : [])].join(',');
  return url.replace('/upload/', `/upload/${transforms}/`);
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no está configurado. Agrega VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET al .env');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Error al subir la imagen a Cloudinary');

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}
