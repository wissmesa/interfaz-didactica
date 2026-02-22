import { companyInfo } from '@/data/site';

export function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-900">Sobre Interfaz Didáctica</h2>
            <p className="mb-6 text-lg text-slate-600">{companyInfo.description}</p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Nuestra Misión</h3>
                <p className="text-slate-600">{companyInfo.mission}</p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Nuestra Visión</h3>
                <p className="text-slate-600">{companyInfo.vision}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-8">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">Nuestros Valores</h3>
            <div className="space-y-4">
              {companyInfo.values.map((value, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-4 h-2 w-2 rounded-full bg-indigo-600"></div>
                  <span className="font-medium text-slate-700">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-indigo-600">{companyInfo.founded}</div>
                <div className="text-slate-600">Año de fundación</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
