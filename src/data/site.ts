export type Category = {
slug: string;
name: string;
description?: string;
};

export type Modality = {
slug: string;
name: string;
description?: string;
};

export type Course = {
slug: string;
title: string;
excerpt?: string;
description: string;
hours?: number;
requirements?: string;
audience?: string;
image?: string;
categorySlug: string;
modalitySlugs: string[];
featured?: boolean;
};

export const categories: Category[] = [
{ slug: 'tecnologicos', name: 'Tecnológicos' },
{ slug: 'atencion-al-cliente', name: 'Atención al Cliente' },
{ slug: 'competencias-gerenciales', name: 'Competencias Gerenciales' },
{ slug: 'desarrollo-profesional', name: 'Desarrollo Profesional y Personal' },
{ slug: 'seguridad-higiene-ambiente', name: 'Seguridad, Higiene y Ambiente' },
{ slug: 'recursos-humanos', name: 'Recursos Humanos' }
];

export const modalities: Modality[] = [
{ slug: 'presencial', name: 'Presencial' },
{ slug: 'online', name: 'Online' },
{ slug: 'in-company', name: 'In-Company' }
];

export const courses: Course[] = [
{
slug: 'excel-basico-8h',
title: 'Excel Básico (8 horas)',
excerpt: 'Fundamentos de Excel: celdas, fórmulas simples y formato.',
description:
'Aprende los fundamentos de Excel incluyendo manejo de hojas, formato, referencias y funciones básicas para el trabajo diario.',
hours: 8,
requirements: 'No se requieren conocimientos previos',
audience: 'Colaboradores que inician en el uso de Excel',
image: '/images/cursos/excel-basico.jpg',
categorySlug: 'tecnologicos',
modalitySlugs: ['presencial', 'online']
},
{
slug: 'excel-intermedio-8h',
title: 'Excel Intermedio (8 horas)',
excerpt:
'Funciones de cálculo, formato condicional y listas para análisis de datos.',
description:
'Profundiza en funciones, validación de datos, formato condicional, tablas y gráficos para análisis efectivo.',
hours: 8,
requirements: 'Conocimientos de Excel Básico',
audience: 'Usuarios que ya dominan lo básico y desean avanzar',
image: '/images/cursos/excel-intermedio.jpg',
categorySlug: 'tecnologicos',
modalitySlugs: ['presencial', 'online'],
featured: true
},
{
slug: 'excel-avanzado',
title: 'Excel Avanzado',
excerpt: 'Tablas dinámicas, funciones avanzadas y automatizaciones básicas.',
description:
'Domina funciones avanzadas, búsqueda y referencia, tablas dinámicas y herramientas de análisis para nivel profesional.',
hours: 16,
requirements: 'Excel Intermedio',
audience: 'Analistas, coordinadores y líderes',
image: '/images/cursos/excel-avanzado.jpg',
categorySlug: 'tecnologicos',
modalitySlugs: ['presencial', 'online', 'in-company']
},
{
slug: 'calidad-atencion-al-cliente',
title: 'Calidad en la Atención al Cliente',
excerpt: 'Herramientas para elevar la experiencia del cliente.',
description:
'Aprende a identificar expectativas del cliente y aplicar habilidades de servicio para mejorar indicadores de satisfacción.',
hours: 8,
audience: 'Equipos de atención y ventas',
image: '/images/cursos/atencion-cliente.jpg',
categorySlug: 'atencion-al-cliente',
modalitySlugs: ['presencial', 'in-company'],
featured: true
},
{
slug: 'supervision-y-liderazgo',
title: 'Supervisión y Liderazgo',
excerpt: 'Habilidades clave para liderar equipos efectivos.',
description:
'Desarrolla competencias de liderazgo, comunicación y seguimiento para potenciar el desempeño del equipo.',
hours: 12,
audience: 'Supervisores y mandos medios',
image: '/images/cursos/liderazgo.jpg',
categorySlug: 'competencias-gerenciales',
modalitySlugs: ['presencial', 'in-company']
}
];

export function getCategoryBySlug(slug: string): Category | undefined {
return categories.find((c) => c.slug === slug);
}

export function getCourseBySlug(slug: string): Course | undefined {
return courses.find((c) => c.slug === slug);
}

export function getCoursesByCategory(slug: string): Course[] {
return courses.filter((c) => c.categorySlug === slug);
}

export type Service = {
title: string;
description: string;
icon: string;
};

export type Testimonial = {
name: string;
position: string;
company: string;
content: string;
rating: number;
};

export type Stat = {
number: string;
label: string;
description: string;
};

export const companyInfo = {
name: 'Interfaz Didáctica',
tagline: 'Especialistas en la Gestión y Capacitación del Talento Humano',
description:
'Somos una empresa líder en capacitación y desarrollo organizacional, comprometida con el crecimiento profesional y la excelencia empresarial.',
founded: '2010',
mission:
'Transformar organizaciones a través del desarrollo del talento humano, proporcionando soluciones de capacitación innovadoras y efectivas.',
vision:
'Ser reconocidos como el socio estratégico preferido para el desarrollo del capital humano en Latinoamérica.',
values: [
'Excelencia en el servicio',
'Innovación continua',
'Compromiso con el cliente',
'Integridad y transparencia',
'Desarrollo sostenible'
]
};

export const services: Service[] = [
{
title: 'Capacitación In-Company',
description:
'Programas personalizados diseñados específicamente para las necesidades de tu organización.',
icon: '🏢'
},
{
title: 'Consultoría Organizacional',
description:
'Asesoramiento especializado para optimizar procesos y mejorar la eficiencia empresarial.',
icon: '📊'
},
{
title: 'Desarrollo de Liderazgo',
description:
'Programas integrales para formar líderes efectivos y equipos de alto rendimiento.',
icon: '👥'
},
{
title: 'Evaluación de Competencias',
description:
'Herramientas avanzadas para medir y desarrollar las habilidades de tu equipo.',
icon: '📈'
}
];

export const testimonials: Testimonial[] = [
{
name: 'María González',
position: 'Directora de RRHH',
company: 'TechCorp',
content:
'Interfaz Didáctica transformó completamente nuestro programa de capacitación. Los resultados fueron excepcionales.',
rating: 5
},
{
name: 'Carlos Rodríguez',
position: 'CEO',
company: 'InnovateLab',
content:
'La calidad de sus programas y el compromiso con nuestros objetivos nos han convertido en clientes fieles.',
rating: 5
},
{
name: 'Ana Martínez',
position: 'Gerente de Operaciones',
company: 'Global Solutions',
content:
'Excelente experiencia. Sus consultores son profesionales de alto nivel con resultados medibles.',
rating: 5
}
];

export const stats: Stat[] = [
{
number: '500+',
label: 'Empresas',
description: 'Clientes satisfechos'
},
{
number: '15,000+',
label: 'Profesionales',
description: 'Capacitados exitosamente'
},
{
number: '50+',
label: 'Programas',
description: 'De capacitación'
},
{
number: '13',
label: 'Años',
description: 'De experiencia'
}
];

export const siteNav = [
{ label: 'Inicio', href: '/' },
{ label: 'Cursos', href: '/cursos' },
{ label: 'Nosotros', href: '/nosotros' },
{ label: 'Contacto', href: '/contacto' }
];
