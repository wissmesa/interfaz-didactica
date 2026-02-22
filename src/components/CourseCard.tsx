import Link from 'next/link';
import Image from 'next/image';
import { getCourseImage } from '@/lib/course-images';

export type CourseCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  hours?: number | null;
  image?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  modality_slugs?: string[] | null;
  modality_names?: string;
};

type Props = {
  course: CourseCardData;
};

export function CourseCard({ course }: Props) {
  const imageUrl = getCourseImage(course.image);
  const modalities = course.modality_names?.split(' · ').filter(Boolean) || [];

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
    >
      {/* Image */}
      <div className="image-zoom-hover relative aspect-[16/10]">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges on image */}
        <div className="absolute top-3 left-3 z-[2] flex items-center gap-2">
          {course.category_name && (
            <span className="text-brand-navy rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
              {course.category_name}
            </span>
          )}
          {course.hours && (
            <span className="bg-brand-orange/90 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {course.hours}h
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="group-hover:text-brand-navy line-clamp-2 text-base font-bold text-slate-900 transition-colors">
          {course.title}
        </h3>

        {course.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {course.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4">
          {/* Modality badges */}
          {modalities.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {modalities.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {m}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <span className="text-brand-orange inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5">
            Ver curso
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
