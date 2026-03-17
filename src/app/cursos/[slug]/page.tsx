import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCourseImage } from '@/lib/course-images';
import { CourseCard, CourseCardData } from '@/components/CourseCard';
import { CourseCtaButton } from '@/components/CourseCtaButton';
import { ContentModulesAccordion } from '@/components/ContentModulesAccordion';

type ContentModule = {
  title: string;
  topics: string[];
  dynamic?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const rows = await sql`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug,
      (SELECT json_agg(m.name ORDER BY m.name) FROM course_modalities cm JOIN modalities m ON m.slug = cm.modality_slug WHERE cm.course_id = c.id) as modality_names
    FROM courses c
    LEFT JOIN categories cat ON cat.slug = c.category_slug
    WHERE c.slug = ${slug} AND c.active = true
  `;

  if (rows.length === 0) {
    const normalized = toSlug(slug);
    if (normalized !== slug) {
      const check = await sql`SELECT slug FROM courses WHERE slug = ${normalized} AND active = true`;
      if (check.length > 0) redirect(`/cursos/${normalized}`);
    }
    return notFound();
  }

  const course = rows[0];
  const modalities = (course.modality_names as string[] | null) || [];
  const imageUrl = getCourseImage(course.image as string | null);

  const specificObjectives: string[] =
    typeof course.specific_objectives === 'string'
      ? JSON.parse(course.specific_objectives)
      : (course.specific_objectives as string[]) || [];
  const courseBenefits: string[] =
    typeof course.benefits === 'string'
      ? JSON.parse(course.benefits)
      : (course.benefits as string[]) || [];
  const contentModules: ContentModule[] =
    typeof course.content_modules === 'string'
      ? JSON.parse(course.content_modules)
      : (course.content_modules as ContentModule[]) || [];

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

  const relatedCourses: CourseCardData[] = relatedRaw.map((c: Record<string, unknown>) => ({
    slug: c.slug as string,
    title: c.title as string,
    general_objective: c.general_objective as string | null,
    hours: c.hours as number | null,
    image: c.image as string | null,
    category_slug: c.category_slug as string | null,
    category_name: c.category_name as string | null,
    modality_names: c.modality_names as string,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative h-[320px] overflow-hidden md:h-[400px]">
        <Image
          src={imageUrl}
          alt={course.title as string}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="from-brand-navy via-brand-navy/70 to-brand-navy/30 absolute inset-0 bg-gradient-to-t" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 md:pb-14 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <Link href="/cursos" className="transition-colors hover:text-white">
                Cursos
              </Link>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="max-w-[200px] truncate font-medium text-white/90">
                {course.title as string}
              </span>
            </nav>

            <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              {course.title as string}
            </h1>

            {/* Info badges */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {course.category_name && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {course.category_name as string}
                </span>
              )}
              {course.hours && (
                <span className="bg-brand-orange/80 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {course.hours as number} horas
                </span>
              )}
              {modalities.map((m) => (
                <span
                  key={m as string}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {m as string}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            {course.description && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Descripción del Curso
                </h2>
                <p className="leading-relaxed whitespace-pre-line text-slate-600">
                  {course.description as string}
                </p>
              </section>
            )}

            {/* Audience */}
            {course.audience && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Dirigido a
                </h2>
                <p className="leading-relaxed whitespace-pre-line text-slate-600">
                  {course.audience as string}
                </p>
              </section>
            )}

            {/* General Objective */}
            {course.general_objective && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Objetivo General
                </h2>
                <p className="leading-relaxed whitespace-pre-line text-slate-600">
                  {course.general_objective as string}
                </p>
              </section>
            )}

            {/* Specific Objectives */}
            {specificObjectives.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Objetivos Específicos
                </h2>
                <ul className="space-y-3 border-l-2 border-slate-200 pl-5">
                  {specificObjectives.map((obj, i) => (
                    <li key={i} className="relative leading-relaxed text-slate-600">
                      <span className="bg-brand-navy absolute -left-[25px] top-[9px] h-2 w-2 rounded-full" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Methodology */}
            {course.methodology && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Metodología de Aprendizaje
                </h2>
                <p className="leading-relaxed whitespace-pre-line text-slate-600">
                  {course.methodology as string}
                </p>
              </section>
            )}

            {/* Benefits */}
            {courseBenefits.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Beneficios para los Participantes
                </h2>
                <ul className="space-y-2.5 pl-1">
                  {courseBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className="text-brand-orange mt-1 h-4 w-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="leading-relaxed text-slate-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Content Modules */}
            {contentModules.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Contenido Programático
                </h2>
                <ContentModulesAccordion modules={contentModules} />
              </section>
            )}

            {/* Requirements */}
            {course.requirements && (
              <section>
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
                  <span className="bg-brand-navy h-5 w-1 rounded-full" />
                  Requisitos
                </h2>
                <p className="leading-relaxed whitespace-pre-line text-slate-600">
                  {course.requirements as string}
                </p>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  ¿Interesado en este curso?
                </h3>
                <p className="mb-5 text-sm text-slate-500">
                  Solicita información sin compromiso y diseñamos un programa a la medida de tu
                  equipo.
                </p>
                <CourseCtaButton className="bg-brand-orange hover:bg-brand-orange-hover w-full cursor-pointer rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md" />
                <Link
                  href="/cursos"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                >
                  Ver más cursos
                </Link>
              </div>

              {/* Quick info card */}
              <div className="bg-brand-navy/5 rounded-2xl p-6">
                <h3 className="text-brand-navy mb-4 text-sm font-bold tracking-wider uppercase">
                  Detalles del curso
                </h3>
                <ul className="space-y-3">
                  {course.category_name && (
                    <li className="flex items-start gap-3 text-sm">
                      <svg
                        className="text-brand-orange mt-0.5 h-4.5 w-4.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <div>
                        <span className="block text-xs text-slate-400">Categoría</span>
                        <span className="font-medium text-slate-700">
                          {course.category_name as string}
                        </span>
                      </div>
                    </li>
                  )}
                  {course.hours && (
                    <li className="flex items-start gap-3 text-sm">
                      <svg
                        className="text-brand-orange mt-0.5 h-4.5 w-4.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <span className="block text-xs text-slate-400">Duración</span>
                        <span className="font-medium text-slate-700">
                          {course.hours as number} horas
                        </span>
                      </div>
                    </li>
                  )}
                  {modalities.length > 0 && (
                    <li className="flex items-start gap-3 text-sm">
                      <svg
                        className="text-brand-orange mt-0.5 h-4.5 w-4.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <span className="block text-xs text-slate-400">Modalidades</span>
                        <span className="font-medium text-slate-700">{modalities.join(', ')}</span>
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
          <section className="mt-16 border-t border-slate-200 pt-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Cursos relacionados</h2>
              <Link
                href={`/cursos?categoria=${course.category_slug}`}
                className="text-brand-orange hover:text-brand-orange-hover hidden items-center gap-1.5 text-sm font-semibold transition-colors sm:inline-flex"
              >
                Ver todos
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
