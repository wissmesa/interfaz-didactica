import Link from 'next/link';
import { sql } from '@/lib/db';
import { CourseCard, CourseCardData } from '@/components/CourseCard';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function getCategories() {
  return sql`SELECT slug, name FROM categories ORDER BY name ASC`;
}

async function getCourseCounts() {
  return sql`
    SELECT category_slug, COUNT(*)::int as count
    FROM courses WHERE active = true
    GROUP BY category_slug
  `;
}

async function getCourses(categorySlug?: string) {
  if (categorySlug) {
    return sql`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug,
        (SELECT string_agg(m.name, ' · ' ORDER BY m.name)
         FROM course_modalities cm
         JOIN modalities m ON m.slug = cm.modality_slug
         WHERE cm.course_id = c.id) as modality_names
      FROM courses c
      LEFT JOIN categories cat ON cat.slug = c.category_slug
      WHERE c.active = true AND c.category_slug = ${categorySlug}
      ORDER BY c.featured DESC, c.title ASC
    `;
  }
  return sql`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug,
      (SELECT string_agg(m.name, ' · ' ORDER BY m.name)
       FROM course_modalities cm
       JOIN modalities m ON m.slug = cm.modality_slug
       WHERE cm.course_id = c.id) as modality_names
    FROM courses c
    LEFT JOIN categories cat ON cat.slug = c.category_slug
    WHERE c.active = true
    ORDER BY c.featured DESC, c.title ASC
  `;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const categoria = typeof params.categoria === 'string' ? params.categoria : undefined;

  const [categories, coursesRaw, counts] = await Promise.all([
    getCategories(),
    getCourses(categoria),
    getCourseCounts(),
  ]);

  const countMap: Record<string, number> = {};
  let totalCourses = 0;
  for (const row of counts) {
    countMap[row.category_slug as string] = row.count as number;
    totalCourses += row.count as number;
  }

  const selectedCategory = categories.find((c: Record<string, string>) => c.slug === categoria);

  const courses: CourseCardData[] = coursesRaw.map((c: Record<string, unknown>) => ({
    slug: c.slug as string,
    title: c.title as string,
    excerpt: c.excerpt as string | null,
    hours: c.hours as number | null,
    image: c.image as string | null,
    category_slug: c.category_slug as string | null,
    category_name: c.category_name as string | null,
    modality_names: c.modality_names as string,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="bg-brand-orange absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/4 translate-y-1/2 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              Inicio
            </Link>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-white/90">Cursos</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Catálogo de Cursos
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/70">
            {totalCourses} programas de formación diseñados para potenciar el talento de tu equipo.
          </p>
        </div>
      </section>

      {/* Filters + Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Link
            href="/cursos"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-brand-orange text-white shadow-sm'
                : 'hover:border-brand-orange hover:text-brand-orange border border-slate-200 bg-white text-slate-600'
            }`}
          >
            Todos
            <span
              className={`text-xs font-bold ${!selectedCategory ? 'text-white/80' : 'text-slate-400'}`}
            >
              {totalCourses}
            </span>
          </Link>
          {categories.map((cat: Record<string, string>) => {
            const isActive =
              (selectedCategory as Record<string, string> | undefined)?.slug === cat.slug;
            const count = countMap[cat.slug] || 0;
            return (
              <Link
                key={cat.slug}
                href={`/cursos?categoria=${cat.slug}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'hover:border-brand-orange hover:text-brand-orange border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {cat.name}
                <span
                  className={`text-xs font-bold ${isActive ? 'text-white/80' : 'text-slate-400'}`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{courses.length}</span>{' '}
            {courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
            {selectedCategory && (
              <>
                {' '}
                en{' '}
                <span className="text-brand-navy font-medium">
                  {(selectedCategory as Record<string, string>).name}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-8 w-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No hay cursos disponibles</h3>
            <p className="mt-1 text-sm text-slate-500">
              No se encontraron cursos en esta categoría. Prueba con otra o explora todos.
            </p>
            <Link
              href="/cursos"
              className="text-brand-orange hover:text-brand-orange-hover mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            >
              Ver todos los cursos
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
