import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getCourseImage } from '@/lib/course-images';
import { CourseCard, CourseCardData } from '@/components/CourseCard';
import { CourseCtaButton } from '@/components/CourseCtaButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const rows = await sql`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug,
      (SELECT json_agg(m.name ORDER BY m.name) FROM course_modalities cm JOIN modalities m ON m.slug = cm.modality_slug WHERE cm.course_id = c.id) as modality_names
    FROM courses c
    LEFT JOIN categories cat ON cat.slug = c.category_slug
    WHERE c.slug = ${slug} AND c.active = true
  `;

  if (rows.length === 0) return notFound();

  const course = rows[0];
  const modalities = (course.modality_names as string[] | null) || [];
  const imageUrl = getCourseImage(course.image as string | null);

  // Related courses (same category, excluding current)
  const relatedRaw = await sql`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug,
      (SELECT string_agg(m.name, ' · ' ORDER BY m.name)
       FROM course_modalities cm
       JOIN modalities m ON m.slug = cm.modality_slug
       WHERE cm.course_id = c.id) as modality_names
    FROM courses c
    LEFT JOIN categories cat ON cat.slug = c.category_slug
    WHERE c.active = true
      AND c.category_slug = ${course.category_slug}
      AND c.slug != ${slug}
    ORDER BY c.featured DESC, RANDOM()
    LIMIT 3
  `;

  const relatedCourses: CourseCardData[] = relatedRaw.map(
    (c: Record<string, unknown>) => ({
      slug: c.slug as string,
      title: c.title as string,
      excerpt: c.excerpt as string | null,
      hours: c.hours as number | null,
      image: c.image as string | null,
      category_slug: c.category_slug as string | null,
      category_name: c.category_name as string | null,
      modality_names: c.modality_names as string,
    })
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative h-[320px] md:h-[400px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={course.title as string}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/cursos" className="hover:text-white transition-colors">Cursos</Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white/90 font-medium truncate max-w-[200px]">
                {course.title as string}
              </span>
            </nav>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-4xl">
              {course.title as string}
            </h1>

            {/* Info badges */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {course.category_name && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {course.category_name as string}
                </span>
              )}
              {course.hours && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-orange/80 text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.hours as number} horas
                </span>
              )}
              {modalities.map((m) => (
                <span
                  key={m as string}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 text-white backdrop-blur-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {m as string}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {course.description && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-orange rounded-full" />
                  Descripción del Curso
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {course.description as string}
                  </p>
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Requisitos
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {course.requirements as string}
                </p>
              </div>
            )}

            {/* Audience */}
            {course.audience && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  Dirigido a
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {course.audience as string}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  ¿Interesado en este curso?
                </h3>
                <p className="text-sm text-slate-500 mb-5">
                  Solicita información sin compromiso y diseñamos un programa a la medida de tu equipo.
                </p>
                <CourseCtaButton className="w-full bg-brand-orange text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-orange-hover transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer" />
                <Link
                  href="/cursos"
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Ver más cursos
                </Link>
              </div>

              {/* Quick info card */}
              <div className="bg-brand-navy/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-brand-navy mb-4 uppercase tracking-wider">
                  Detalles del curso
                </h3>
                <ul className="space-y-3">
                  {course.category_name && (
                    <li className="flex items-start gap-3 text-sm">
                      <svg className="w-4.5 h-4.5 text-brand-orange shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div>
                        <span className="text-slate-400 block text-xs">Categoría</span>
                        <span className="text-slate-700 font-medium">{course.category_name as string}</span>
                      </div>
                    </li>
                  )}
                  {course.hours && (
                    <li className="flex items-start gap-3 text-sm">
                      <svg className="w-4.5 h-4.5 text-brand-orange shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-slate-400 block text-xs">Duración</span>
                        <span className="text-slate-700 font-medium">{course.hours as number} horas</span>
                      </div>
                    </li>
                  )}
                  {modalities.length > 0 && (
                    <li className="flex items-start gap-3 text-sm">
                      <svg className="w-4.5 h-4.5 text-brand-orange shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="text-slate-400 block text-xs">Modalidades</span>
                        <span className="text-slate-700 font-medium">{modalities.join(', ')}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Cursos relacionados
              </h2>
              <Link
                href={`/cursos?categoria=${course.category_slug}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedCourses.map((rc) => (
                <CourseCard key={rc.slug} course={rc} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
