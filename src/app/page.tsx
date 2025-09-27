'use client';

import Link from 'next/link';
import {
categories,
courses,
services,
testimonials,
stats
} from '@/data/site';
import { CourseCard } from '@/components/CourseCard';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { StatsSection } from '@/components/StatsSection';
import { CTASection } from '@/components/CTASection';
import { useContact } from '@/components/ClientLayout';

export default function Home() {
const { openContactModal } = useContact();
const featured = courses.filter((c) => c.featured);

return (
<div>
{/* Hero Section */}
<section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white text-slate-900 relative overflow-hidden">
{/* Background Pattern */}
<div className="absolute inset-0">
<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 via-yellow-50 to-blue-100"></div>
<div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
<div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
<div className="absolute -bottom-8 left-8 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,165,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
</div>

<div className="max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
{/* Main Content */}
<div className="max-w-4xl mx-auto">
<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
Interfaz Didáctica
</h1>
<p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
Especialistas en la Gestión y Capacitación del Talento Humano
</p>
<p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
Transformamos organizaciones a través del desarrollo del talento humano con
soluciones de capacitación innovadoras y efectivas.
</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button
onClick={openContactModal}
className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
>
Solicitar Consulta Gratuita
</button>
<Link
href="/cursos"
className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 text-lg"
>
Explorar Cursos
</Link>
</div>
</div>
</div>

{/* Scroll Indicator */}
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
<div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
<div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
</div>
</div>
</section>

{/* About Section */}
<AboutSection />

{/* Services Section */}
<ServicesSection services={services} />

{/* Stats Section */}
<StatsSection stats={stats} />

{/* Categories Section */}
<section className="py-16 bg-white">
<div className="max-w-6xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl font-bold text-slate-900 mb-4">Categorías de Cursos</h2>
<p className="text-slate-600 text-lg">
Descubre nuestras áreas de especialización
</p>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
{categories.map((cat) => (
<Link
key={cat.slug}
href={`/cursos?categoria=${cat.slug}`}
className="rounded-lg border bg-white p-6 text-center hover:shadow-md transition-shadow"
>
<div className="text-lg font-semibold text-slate-900 mb-2">{cat.name}</div>
{cat.description && (
<div className="text-sm text-slate-600">{cat.description}</div>
)}
</Link>
))}
</div>

<div className="text-center mt-8">
<Link
href="/cursos"
className="text-indigo-600 hover:text-indigo-700 font-semibold"
>
Ver todos los cursos →
</Link>
</div>
</div>
</section>

{/* Featured Courses Section */}
{featured.length > 0 && (
<section className="py-16 bg-slate-50">
<div className="max-w-6xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl font-bold text-slate-900 mb-4">Cursos Destacados</h2>
<p className="text-slate-600 text-lg">
Nuestros programas más populares y efectivos
</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{featured.map((course) => (
<CourseCard key={course.slug} course={course} />
))}
</div>
</div>
</section>
)}

{/* Testimonials Section */}
<TestimonialsSection testimonials={testimonials} />

{/* CTA Section */}
<CTASection />
</div>
);
}
