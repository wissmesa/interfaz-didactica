import { getCourseBySlug, categories, modalities } from "@/data/site";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return notFound();
  const category = categories.find((c) => c.slug === course.categorySlug)?.name;
  const modalityNames = course.modalitySlugs
    .map((s) => modalities.find((m) => m.slug === s)?.name)
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500">{category}</p>
      <h1 className="mb-2">{course.title}</h1>
      {course.hours ? (
        <p className="text-sm text-slate-500">Duración: {course.hours} horas</p>
      ) : null}
      <p className="text-sm text-slate-500">Modalidades: {modalityNames}</p>
      <hr className="my-6" />
      <p className="text-base leading-relaxed">{course.description}</p>
      {course.requirements ? (
        <>
          <h2 className="mt-8">Requisitos</h2>
          <p>{course.requirements}</p>
        </>
      ) : null}
      {course.audience ? (
        <>
          <h2 className="mt-8">Dirigido a</h2>
          <p>{course.audience}</p>
        </>
      ) : null}
    </article>
  );
}
