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
  { slug: 'recursos-humanos', name: 'Recursos Humanos' },
];

export const modalities: Modality[] = [
  { slug: 'presencial', name: 'Presencial' },
  { slug: 'online', name: 'Online' },
  { slug: 'in-company', name: 'In-Company' },
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
    modalitySlugs: ['presencial', 'online'],
  },
  {
    slug: 'excel-intermedio-8h',
    title: 'Excel Intermedio (8 horas)',
    excerpt: 'Funciones de cálculo, formato condicional y listas para análisis de datos.',
    description:
      'Profundiza en funciones, validación de datos, formato condicional, tablas y gráficos para análisis efectivo.',
    hours: 8,
    requirements: 'Conocimientos de Excel Básico',
    audience: 'Usuarios que ya dominan lo básico y desean avanzar',
    image: '/images/cursos/excel-intermedio.jpg',
    categorySlug: 'tecnologicos',
    modalitySlugs: ['presencial', 'online'],
    featured: true,
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
    modalitySlugs: ['presencial', 'online', 'in-company'],
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
    featured: true,
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
    modalitySlugs: ['presencial', 'in-company'],
  },
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
  initials: string;
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
    'Interfaz Didáctica, C.A. es una organización fundada en el año 2007, orientada a ofrecer a corporaciones, empresas e instituciones apoyo en la formación, capacitación y asesoría de su personal en el área de tecnología informática, gerencia, atención al cliente, desarrollo profesional y personal, contando para ello con un grupo de profesionales de primera línea con experiencia en esta actividad.',
  descriptionExtended:
    'Estamos constantemente en la búsqueda de las soluciones de capacitación que mejor se adapten a los objetivos de negocios de cada cliente y presentar propuestas personalizadas que contemplen los requerimientos y exigencias de cada organización, de manera que cada participante obtenga el mayor retorno en la capacitación emprendida.',
  founded: '2007',
  mission:
    'Ayudar a los individuos de organizaciones privadas o públicas a desarrollar sus competencias, habilidades y conocimientos en las áreas de informática, competencias gerenciales, atención al cliente, desarrollo profesional y personal, siempre comprometidos en prestar un servicio excelente al cliente.',
  vision:
    'Ser la empresa de primera opción en el proceso de capacitación, formación y consultoría del talento humano en las empresas y organizaciones privadas y públicas.',
  values: ['Excelencia', 'Calidad', 'Responsabilidad', 'Compromiso', 'Innovación'],
};

export const services: Service[] = [
  {
    title: 'Capacitación In-Company',
    description:
      'Programas personalizados diseñados específicamente para las necesidades de tu organización.',
    icon: '🏢',
  },
  {
    title: 'Consultoría Organizacional',
    description:
      'Asesoramiento especializado para optimizar procesos y mejorar la eficiencia empresarial.',
    icon: '📊',
  },
  {
    title: 'Desarrollo de Liderazgo',
    description:
      'Programas integrales para formar líderes efectivos y equipos de alto rendimiento.',
    icon: '👥',
  },
  {
    title: 'Evaluación de Competencias',
    description: 'Herramientas avanzadas para medir y desarrollar las habilidades de tu equipo.',
    icon: '📈',
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'María González',
    position: 'Directora de RRHH',
    company: 'TechCorp Venezuela',
    content:
      'Interfaz Didáctica transformó completamente nuestro programa de capacitación. Capacitaron a más de 80 colaboradores en Excel avanzado y los resultados en productividad fueron inmediatos.',
    rating: 5,
    initials: 'MG',
  },
  {
    name: 'Carlos Rodríguez',
    position: 'CEO',
    company: 'InnovateLab',
    content:
      'La calidad de sus programas y el compromiso con nuestros objetivos nos han convertido en clientes recurrentes. Su equipo de instructores es de primer nivel.',
    rating: 5,
    initials: 'CR',
  },
  {
    name: 'Ana Martínez',
    position: 'Gerente de Operaciones',
    company: 'Global Solutions',
    content:
      'Contratamos el programa de Atención al Cliente para nuestro equipo de 40 personas. La mejora en los indicadores de satisfacción fue notable en solo dos meses.',
    rating: 5,
    initials: 'AM',
  },
];

export const stats: Stat[] = [
  {
    number: '500+',
    label: 'Empresas',
    description: 'Clientes satisfechos',
  },
  {
    number: '15,000+',
    label: 'Profesionales',
    description: 'Capacitados exitosamente',
  },
  {
    number: '50+',
    label: 'Programas',
    description: 'De capacitación',
  },
  {
    number: '13',
    label: 'Años',
    description: 'De experiencia',
  },
];

/* ── Landing page specific data ── */

export const heroImage =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&fit=crop&crop=faces';

export type AreaFormacion = {
  title: string;
  copy: string;
  icon: 'ofimatica' | 'atencion' | 'liderazgo';
  image: string;
  bullets: string[];
};

export const areasFormacion: AreaFormacion[] = [
  {
    title: 'Ofimática Profesional',
    copy: 'Domina el paquete Office (Excel de Básico a Avanzado, Word y PowerPoint) para optimizar la productividad operativa de tu empresa.',
    icon: 'ofimatica',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fit=crop',
    bullets: [
      'Excel Básico, Intermedio y Avanzado',
      'Word corporativo y plantillas profesionales',
      'PowerPoint para presentaciones de impacto',
      'Automatización con fórmulas y tablas dinámicas',
    ],
  },
  {
    title: 'Atención al Cliente Premium',
    copy: 'Herramientas de comunicación, manejo de conflictos y protocolos de servicio para fidelizar a tus clientes.',
    icon: 'atencion',
    image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&fit=crop&crop=faces',
    bullets: [
      'Comunicación asertiva y escucha activa',
      'Manejo de quejas y situaciones difíciles',
      'Protocolos de servicio al cliente',
      'Técnicas de fidelización y seguimiento',
    ],
  },
  {
    title: 'Liderazgo y Gerencia',
    copy: 'Capacitación en toma de decisiones, gestión de equipos y habilidades directivas para mandos medios y altos.',
    icon: 'liderazgo',
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&fit=crop&crop=faces',
    bullets: [
      'Liderazgo situacional y coaching de equipos',
      'Toma de decisiones estratégicas',
      'Gestión del cambio organizacional',
      'Comunicación ejecutiva y negociación',
    ],
  },
];

export type ModalidadEstudio = {
  title: string;
  copy: string;
  icon: 'incompany' | 'incenter' | 'virtual';
  image: string;
};

export const modalidadesEstudio: ModalidadEstudio[] = [
  {
    title: 'In-Company',
    copy: 'Llevamos el adiestramiento directamente a tus instalaciones en todo el país.',
    icon: 'incompany',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&fit=crop&crop=faces',
  },
  {
    title: 'In-Center',
    copy: 'Clases presenciales en nuestras aulas ejecutivas en Campo Alegre, Caracas.',
    icon: 'incenter',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80&fit=crop&crop=faces',
  },
  {
    title: 'Virtual en Vivo',
    copy: 'Formación remota interactiva para equipos distribuidos.',
    icon: 'virtual',
    image:
      'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80&fit=crop&crop=faces',
  },
];

export const porQueElegirnos = {
  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&fit=crop',
  headline: 'Desde 2007 formando el talento que mueve a Venezuela',
  description:
    'Somos una organización orientada a ofrecer a corporaciones, empresas e instituciones apoyo en la formación, capacitación y asesoría de su personal. Presentamos propuestas personalizadas que contemplan los requerimientos de cada organización, de manera que cada participante obtenga el mayor retorno en la capacitación emprendida.',
  differentiators: [
    'Propuestas 100% personalizadas a los objetivos de tu empresa',
    'Profesionales de primera línea con experiencia corporativa real',
    'Seguimiento y soporte post-formación incluido',
    'Certificados de participación avalados',
  ],
};

export const landingStats = [
  { number: '18+', label: 'Años de experiencia' },
  { number: '150+', label: 'Empresas atendidas' },
  { number: '3,000+', label: 'Profesionales formados' },
  { number: '50+', label: 'Programas disponibles' },
];

export const siteNav = [
  { label: 'Áreas de Formación', href: '/#areas' },
  { label: 'Modalidades', href: '/#modalidades' },
  { label: 'Ubicación', href: '/#ubicacion' },
];
