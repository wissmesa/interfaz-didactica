'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  areasFormacion,
  modalidadesEstudio,
  heroImage,
  landingStats,
  porQueElegirnos,
  companyInfo,
} from '@/data/site';
import { useContact } from '@/components/ClientLayout';

type DbTestimonial = {
  id: number;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  rating: number;
  initials: string | null;
};

type DbCompany = {
  id: number;
  name: string;
  logo_url: string | null;
};

/* ── SVG Icon Components ── */

function OfimaticaIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="36" x2="42" y2="36" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="36" width="12" height="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 16h6v4h-6zM22 16h12v2H22zM22 20h8v2h-8zM14 24h20v2H14z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function AtencionIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 40c0-7.732 6.268-14 14-14s14 6.268 14 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 14l4-4m0 0l4 4m-4-4v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LiderazgoIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 6l4 8 9 1.3-6.5 6.3L32 31 24 26.7 16 31l1.5-9.4L11 15.3l9-1.3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 36h24M16 42h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function InCompanyIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 14l16-8 16 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="14" y="22" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="28" y="22" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="20" y="32" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function InCenterIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="40" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="16" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="26" x2="36" y2="26" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="22" r="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="36" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function VirtualIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17 28c0-3.866 3.134-7 7-7s7 3.134 7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M14 40h20M18 36h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="38" cy="12" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const areaIcons = {
  ofimatica: OfimaticaIcon,
  atencion: AtencionIcon,
  liderazgo: LiderazgoIcon,
} as const;

const modalityIcons = {
  incompany: InCompanyIcon,
  incenter: InCenterIcon,
  virtual: VirtualIcon,
} as const;

export default function Home() {
  const { openContactModal } = useContact();
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [companies, setCompanies] = useState<DbCompany[]>([]);
  const AREA_OPTIONS = [
    { value: 'ofimatica', label: 'Ofimática' },
    { value: 'atencion-cliente', label: 'Atención al Cliente' },
    { value: 'gerencia', label: 'Gerencia' },
  ];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    teamSize: '',
    areas: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => {});
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArea = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.includes(value)
        ? prev.areas.filter((a) => a !== value)
        : [...prev.areas, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.areas.length === 0) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const areasLabel = formData.areas
      .map((v) => AREA_OPTIONS.find((o) => o.value === v)?.label || v)
      .join(', ');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName.split(' ')[0] || formData.fullName,
          lastname: formData.fullName.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: '',
          interest: formData.areas.join(','),
          message: `Empresa: ${formData.company} | Personas: ${formData.teamSize} | Áreas: ${areasLabel}`,
          source: 'landing-footer-form',
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al enviar');

      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({ fullName: '', email: '', company: '', teamSize: '', areas: [] });
        setSubmitStatus('idle');
      }, 4000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/60 to-blue-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,35,102,0.05),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-28 lg:px-8 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Copy */}
            <div className="animate-fade-in-up">
              <div className="bg-brand-orange/10 text-brand-orange mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
                <span className="bg-brand-orange h-2 w-2 rounded-full" />
                18+ años formando talento en Venezuela
              </div>

              <h1 className="text-brand-navy text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
                Potencia el talento de tu equipo con formación integral.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Especialistas en Ofimática, Atención al Cliente y Desarrollo Gerencial. Soluciones a
                medida para empresas con más de 18 años de trayectoria en Caracas.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/cursos"
                  className="bg-brand-orange hover:bg-brand-orange-hover inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Ver Catálogo de Cursos
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                <button
                  onClick={openContactModal}
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy inline-flex items-center justify-center rounded-lg border-2 px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:text-white"
                >
                  Diagnóstico de Nivel Gratis
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="animate-fade-in-up animation-delay-200 relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={heroImage}
                  alt="Equipo de profesionales en sesión de capacitación empresarial"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative accent */}
              <div className="bg-brand-orange/10 absolute -right-4 -bottom-4 -z-10 h-24 w-24 rounded-2xl" />
              <div className="bg-brand-navy/5 absolute -top-4 -left-4 -z-10 h-16 w-16 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CIFRAS QUE HABLAN ═══════════════════ */}
      <section className="border-y border-slate-100 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {landingStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`animate-count-up text-center`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-brand-orange mb-1 text-3xl font-bold sm:text-4xl lg:text-5xl">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-slate-600 sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ÁREAS DE FORMACIÓN ═══════════════════ */}
      <section id="areas" className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-brand-orange mb-3 text-sm font-semibold tracking-widest uppercase">
              Nuestras especialidades
            </p>
            <h2 className="text-brand-navy text-3xl font-bold tracking-tight sm:text-4xl">
              Áreas de Formación
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Programas diseñados por expertos para cubrir las necesidades más demandadas por las
              empresas venezolanas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {areasFormacion.map((area) => {
              const IconComponent = areaIcons[area.icon];
              return (
                <div
                  key={area.title}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="image-zoom-hover relative aspect-[16/10]">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-brand-orange/10 text-brand-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="text-brand-navy text-lg font-bold">{area.title}</h3>
                    </div>

                    <p className="mb-5 leading-relaxed text-slate-600">{area.copy}</p>

                    <ul className="space-y-2">
                      {area.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-slate-500">
                          <CheckIcon className="text-brand-orange mt-0.5 h-4 w-4 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ QUIÉNES SOMOS ═══════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top: Image + Company description */}
          <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={porQueElegirnos.image}
                  alt="Aulas modernas de formación ejecutiva en Caracas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="bg-brand-orange/10 absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-2xl" />
            </div>

            {/* Right: Copy */}
            <div>
              <p className="text-brand-orange mb-3 text-sm font-semibold tracking-widest uppercase">
                Quiénes Somos
              </p>
              <h2 className="text-brand-navy mb-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                {porQueElegirnos.headline}
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-slate-600">
                {companyInfo.description}
              </p>
              <p className="mb-8 leading-relaxed text-slate-500">
                {companyInfo.descriptionExtended}
              </p>

              <div className="space-y-3">
                {porQueElegirnos.differentiators.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="bg-brand-orange mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={openContactModal}
                  className="bg-brand-navy hover:bg-brand-navy-light inline-flex items-center rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Solicitar propuesta personalizada
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ MODALIDADES DE ESTUDIO ═══════════════════ */}
      <section id="modalidades" className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-brand-orange mb-3 text-sm font-semibold tracking-widest uppercase">
              Flexibilidad total
            </p>
            <h2 className="text-brand-navy text-3xl font-bold tracking-tight sm:text-4xl">
              Modalidades de Estudio
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Adaptamos la formación al ritmo y necesidades de tu organización, sin importar dónde
              esté tu equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {modalidadesEstudio.map((mod) => {
              const IconComponent = modalityIcons[mod.icon];
              return (
                <div
                  key={mod.title}
                  className="group image-overlay relative aspect-[3/4] cursor-default overflow-hidden rounded-2xl md:aspect-[3/4]"
                >
                  {/* Background photo */}
                  <Image
                    src={mod.image}
                    alt={mod.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Content overlay */}
                  <div className="absolute inset-0 z-[2] flex flex-col items-center justify-end p-8 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-sm">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-white">{mod.title}</h3>
                    <p className="max-w-xs leading-relaxed text-white/80">{mod.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRUEBA SOCIAL ═══════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-brand-orange mb-3 text-sm font-semibold tracking-widest uppercase">
              Clientes satisfechos
            </p>
            <h2 className="text-brand-navy text-3xl font-bold tracking-tight sm:text-4xl">
              Más de <span className="text-brand-orange">150 empresas</span> confían en nosotros
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Empresas de todos los sectores en Venezuela han transformado su productividad con
              nuestros programas.
            </p>
          </div>

          {/* Testimonials */}
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-shadow duration-300 hover:shadow-md"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-6 leading-relaxed text-slate-700 italic">
                  &ldquo;{t.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="bg-brand-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">
                      {t.position}, {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company logos */}
          {companies.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {companies.map((c) =>
                c.logo_url ? (
                  <div
                    key={c.id}
                    className="relative h-10 w-28 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  >
                    <Image
                      src={c.logo_url}
                      alt={c.name}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  </div>
                ) : (
                  <div
                    key={c.id}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400"
                  >
                    {c.name}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-30 md:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-28 rounded-md bg-slate-300" aria-hidden="true" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════ CONTACTO / FOOTER ═══════════════════ */}
      <section id="ubicacion" className="bg-brand-navy relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(242,133,0,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* Left: copy + info */}
            <div>
              <h2 className="mb-6 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
                ¿Listo para transformar la productividad de tu empresa?
              </h2>

              <p className="mb-10 text-lg leading-relaxed text-slate-300">
                Completa el formulario y uno de nuestros asesores se comunicará contigo en menos de
                24 horas con una propuesta personalizada.
              </p>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="text-brand-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Dirección</p>
                    <p className="text-sm text-slate-400">
                      Torre La Primera, Piso 15, Campo Alegre, Caracas.
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="text-brand-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">WhatsApp</p>
                    <a
                      href="https://wa.me/584125957732"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-slate-400 hover:text-brand-orange transition-colors underline decoration-slate-600 underline-offset-2"
                    >
                      +58 412-595-7732 &middot; Escríbenos &rarr;
                    </a>
                  </div>
                </div>

                {/* Teléfonos fijos */}
                <div className="flex items-start gap-4">
                  <div className="text-brand-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Teléfonos</p>
                    <p className="text-sm text-slate-400">+58 212-266-9908</p>
                    <p className="text-sm text-slate-400">+58 212-312-6389</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-10">
              {submitStatus === 'success' ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-8 w-8 text-green-600"
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
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">¡Solicitud enviada!</h3>
                  <p className="text-slate-600">
                    Nos pondremos en contacto contigo en las próximas 24 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ej: María García"
                      className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Correo Corporativo
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nombre@empresa.com"
                      className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="company"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Empresa
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nombre de tu empresa"
                        className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="teamSize"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Nro. de personas
                      </label>
                      <input
                        type="text"
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        placeholder="Ej: 15"
                        className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-medium text-slate-700">
                      Áreas de Interés *
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AREA_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleArea(opt.value)}
                          className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            formData.areas.includes(opt.value)
                              ? 'bg-brand-orange border-brand-orange text-white shadow-sm'
                              : 'hover:border-brand-orange/50 border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {formData.areas.length === 0 && (
                      <p className="mt-1.5 text-xs text-slate-400">Selecciona al menos un área</p>
                    )}
                  </div>

                  {submitStatus === 'error' && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      Hubo un error al enviar. Por favor, intenta nuevamente.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-orange hover:bg-brand-orange-hover flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Enviando...
                      </>
                    ) : (
                      'Solicitar Asesoría Gratuita'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Interfaz Didáctica C.A. Todos los derechos
              reservados.
            </p>
            <p>Torre La Primera, Piso 15, Campo Alegre, Caracas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
