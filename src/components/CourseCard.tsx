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
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] image-zoom-hover">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1]" />

        {/* Badges on image */}
        <div className="absolute top-3 left-3 z-[2] flex items-center gap-2">
          {course.category_name && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-brand-navy backdrop-blur-sm">
              {course.category_name}
            </span>
          )}
          {course.hours && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-brand-orange/90 text-white backdrop-blur-sm">
              {course.hours}h
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-brand-navy transition-colors">
          {course.title}
        </h3>

        {course.excerpt && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {course.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4">
          {/* Modality badges */}
          {modalities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {modalities.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                >
                  {m}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange group-hover:gap-2.5 transition-all">
            Ver curso
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
