import { CourseForm } from '@/components/admin/CourseForm';

export default function NuevoCursoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Nuevo Curso</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <CourseForm />
      </div>
    </div>
  );
}
