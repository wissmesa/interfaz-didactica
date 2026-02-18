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

export default function EditarCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12 text-slate-500">Curso no encontrado.</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar Curso</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <CourseForm course={course} />
      </div>
    </div>
  );
}
