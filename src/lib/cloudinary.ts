export function cloudinaryWebP(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const transforms = ['f_webp', 'q_auto', ...(width ? [`w_${width}`] : [])].join(',');
  return url.replace('/upload/', `/upload/${transforms}/`);
}
