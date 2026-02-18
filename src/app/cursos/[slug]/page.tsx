import { sql } from "@/lib/db";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const rows = await sql`
    SELECT c.*, cat.name as category_name,
      (SELECT json_agg(m.name) FROM course_modalities cm JOIN modalities m ON m.slug = cm.modality_slug WHERE cm.course_id = c.id) as modality_names
    FROM courses c
    LEFT JOIN categories cat ON cat.slug = c.category_slug
    WHERE c.slug = ${slug} AND c.active = true
  `;

  if (rows.length === 0) return notFound();

  const course = rows[0];
  const modalityNames = (course.modality_names as string[] | null)?.join(" · ") || "";

  return (
    <article className="prose prose-slate max-w-none">
      <p className="text-sm text-slate-500">{course.category_name}</p>
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
