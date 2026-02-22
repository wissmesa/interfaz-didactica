export const COURSE_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80&fit=crop&crop=faces';

export function getCourseImage(
  image: string | null | undefined
): string {
  if (image) return image;
  return COURSE_FALLBACK_IMAGE;
}
