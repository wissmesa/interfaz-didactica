import Link from "next/link";
import { sql } from "@/lib/db";
import { CourseCard, CourseCardData } from "@/components/CourseCard";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function getCategories() {
  return sql`SELECT slug, name FROM categories ORDER BY name ASC`;
}

async function getCourses(categorySlug?: string) {
  if (categorySlug) {
    return sql`
      SELECT c.*, cat.name as category_name,
        (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
      FROM courses c
      LEFT JOIN categories cat ON cat.slug = c.category_slug
      WHERE c.active = true AND c.category_slug = ${categorySlug}
      ORDER BY c.featured DESC, c.title ASC
    `;
  }
  return sql`
    SELECT c.*, cat.name as category_name,
      (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
    FROM courses c
    LEFT JOIN categories cat ON cat.slug = c.category_slug
    WHERE c.active = true
    ORDER BY c.featured DESC, c.title ASC
  `;
}

async function getModalityNames(slugs: string[] | null): Promise<string> {
  if (!slugs || slugs.length === 0) return '';
  const rows = await sql`SELECT slug, name FROM modalities WHERE slug = ANY(${slugs})`;
  return rows.map((r: Record<string, string>) => r.name).join(' · ');
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const categoria =
    typeof params.categoria === "string" ? params.categoria : undefined;

  const [categories, coursesRaw] = await Promise.all([
    getCategories(),
    getCourses(categoria),
  ]);

  const selectedCategory = categories.find(
    (c: Record<string, string>) => c.slug === categoria
  );

  const courses: CourseCardData[] = await Promise.all(
    coursesRaw.map(async (c: Record<string, unknown>) => ({
      slug: c.slug as string,
      title: c.title as string,
      excerpt: c.excerpt as string | null,
      hours: c.hours as number | null,
      image: c.image as string | null,
      category_slug: c.category_slug as string | null,
      category_name: c.category_name as string | null,
      modality_slugs: c.modality_slugs as string[] | null,
      modality_names: await getModalityNames(c.modality_slugs as string[] | null),
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-semibold">
          Cursos{" "}
          {selectedCategory
            ? `· ${(selectedCategory as Record<string, string>).name}`
            : ""}
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/cursos"
          className={
            !selectedCategory
              ? "px-3 py-1 rounded-full bg-indigo-600 text-white text-sm"
              : "px-3 py-1 rounded-full bg-white border text-sm"
          }
        >
          Todos
        </Link>
        {categories.map((cat: Record<string, string>) => (
          <Link
            key={cat.slug}
            href={`/cursos?categoria=${cat.slug}`}
            className={
              (selectedCategory as Record<string, string> | undefined)?.slug ===
              cat.slug
                ? "px-3 py-1 rounded-full bg-indigo-600 text-white text-sm"
                : "px-3 py-1 rounded-full bg-white border text-sm"
            }
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
