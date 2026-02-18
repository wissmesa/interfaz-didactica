'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Course = {
  id: number;
  slug: string;
  title: string;
  category_slug: string;
  hours: number | null;
  featured: boolean;
  active: boolean;
  modality_slugs: string[] | null;
};

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleActive = async (id: number, active: boolean) => {
    await fetch(`/api/admin/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchCourses();
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cursos</h1>
        <Link
          href="/admin/cursos/nuevo"
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-navy-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No hay cursos registrados.</p>
          <Link href="/admin/cursos/nuevo" className="text-brand-navy font-medium text-sm mt-2 inline-block hover:underline">
            Crear el primer curso
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Horas</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{course.title}</span>
                      {course.featured && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                          Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{course.category_slug || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{course.hours ? `${course.hours}h` : '—'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(course.id, course.active)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {course.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/cursos/${course.id}/editar`}
                        className="text-sm text-brand-navy hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
