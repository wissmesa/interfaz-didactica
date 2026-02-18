import Link from "next/link";
import Image from "next/image";

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
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="relative h-40 w-full bg-slate-100">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="mb-1 text-xs text-slate-500">
          {course.category_name || course.category_slug || ''} {course.hours ? `· ${course.hours}h` : ""}
        </div>
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
          {course.title}
        </h3>
        {course.excerpt ? (
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
            {course.excerpt}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-slate-500 truncate" title={course.modality_names || ''}>
            {course.modality_names || ''}
          </div>
          <Link
            href={`/cursos/${course.slug}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Ver más →
          </Link>
        </div>
      </div>
    </div>
  );
}
