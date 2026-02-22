'use client';

import { useEffect, useState, use } from 'react';
import { CourseForm } from '@/components/admin/CourseForm';

type CourseData = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  hours: number | null;
  requirements: string;
  audience: string;
  image: string;
  category_slug: string;
  modality_slugs: string[] | null;
  featured: boolean;
};

export default function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data.course))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-navy h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return <div className="py-12 text-center text-slate-500">Curso no encontrado.</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Editar Curso</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <CourseForm course={course} />
      </div>
    </div>
  );
}
