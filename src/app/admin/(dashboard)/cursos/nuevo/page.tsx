import { CourseForm } from '@/components/admin/CourseForm';

export default function NuevoCursoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Nuevo Curso</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <CourseForm />
      </div>
    </div>
  );
}
