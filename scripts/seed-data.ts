import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const categories = [
  { slug: 'tecnologicos', name: 'Tecnológicos' },
  { slug: 'atencion-al-cliente', name: 'Atención al Cliente' },
  { slug: 'competencias-gerenciales', name: 'Competencias Gerenciales' },
  { slug: 'desarrollo-profesional', name: 'Desarrollo Profesional y Personal' },
  { slug: 'seguridad-higiene-ambiente', name: 'Seguridad, Higiene y Ambiente' },
  { slug: 'recursos-humanos', name: 'Recursos Humanos' },
];

const modalities = [
  { slug: 'presencial', name: 'Presencial' },
  { slug: 'online', name: 'Online' },
  { slug: 'in-company', name: 'In-Company' },
];

const courses = [
  {
    slug: 'excel-basico-8h',
    title: 'Excel Básico (8 horas)',
    excerpt: 'Fundamentos de Excel: celdas, fórmulas simples y formato.',
    description: 'Aprende los fundamentos de Excel incluyendo manejo de hojas, formato, referencias y funciones básicas para el trabajo diario.',
    hours: 8,
    requirements: 'No se requieren conocimientos previos',
    audience: 'Colaboradores que inician en el uso de Excel',
    image: '/images/cursos/excel-basico.jpg',
    categorySlug: 'tecnologicos',
    modalitySlugs: ['presencial', 'online'],
    featured: false,
  },
  {
    slug: 'excel-intermedio-8h',
    title: 'Excel Intermedio (8 horas)',
    excerpt: 'Funciones de cálculo, formato condicional y listas para análisis de datos.',
    description: 'Profundiza en funciones, validación de datos, formato condicional, tablas y gráficos para análisis efectivo.',
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
    description: 'Domina funciones avanzadas, búsqueda y referencia, tablas dinámicas y herramientas de análisis para nivel profesional.',
    hours: 16,
    requirements: 'Excel Intermedio',
    audience: 'Analistas, coordinadores y líderes',
    image: '/images/cursos/excel-avanzado.jpg',
    categorySlug: 'tecnologicos',
    modalitySlugs: ['presencial', 'online', 'in-company'],
    featured: false,
  },
  {
    slug: 'calidad-atencion-al-cliente',
    title: 'Calidad en la Atención al Cliente',
    excerpt: 'Herramientas para elevar la experiencia del cliente.',
    description: 'Aprende a identificar expectativas del cliente y aplicar habilidades de servicio para mejorar indicadores de satisfacción.',
    hours: 8,
    requirements: null,
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
    description: 'Desarrolla competencias de liderazgo, comunicación y seguimiento para potenciar el desempeño del equipo.',
    hours: 12,
    requirements: null,
    audience: 'Supervisores y mandos medios',
    image: '/images/cursos/liderazgo.jpg',
    categorySlug: 'competencias-gerenciales',
    modalitySlugs: ['presencial', 'in-company'],
    featured: false,
  },
];

const testimonials = [
  {
    name: 'María González',
    position: 'Directora de RRHH',
    company: 'TechCorp Venezuela',
    content: 'Interfaz Didáctica transformó completamente nuestro programa de capacitación. Capacitaron a más de 80 colaboradores en Excel avanzado y los resultados en productividad fueron inmediatos.',
    rating: 5,
    initials: 'MG',
  },
  {
    name: 'Carlos Rodríguez',
    position: 'CEO',
    company: 'InnovateLab',
    content: 'La calidad de sus programas y el compromiso con nuestros objetivos nos han convertido en clientes recurrentes. Su equipo de instructores es de primer nivel.',
    rating: 5,
    initials: 'CR',
  },
  {
    name: 'Ana Martínez',
    position: 'Gerente de Operaciones',
    company: 'Global Solutions',
    content: 'Contratamos el programa de Atención al Cliente para nuestro equipo de 40 personas. La mejora en los indicadores de satisfacción fue notable en solo dos meses.',
    rating: 5,
    initials: 'AM',
  },
];

async function seed() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    await sql`
      INSERT INTO categories (slug, name)
      VALUES (${cat.slug}, ${cat.name})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  console.log('Seeding modalities...');
  for (const mod of modalities) {
    await sql`
      INSERT INTO modalities (slug, name)
      VALUES (${mod.slug}, ${mod.name})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  console.log('Seeding courses...');
  for (const course of courses) {
    const rows = await sql`
      INSERT INTO courses (slug, title, excerpt, description, hours, requirements, audience, image, category_slug, featured)
      VALUES (${course.slug}, ${course.title}, ${course.excerpt}, ${course.description}, ${course.hours}, ${course.requirements}, ${course.audience}, ${course.image}, ${course.categorySlug}, ${course.featured})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        description = EXCLUDED.description,
        hours = EXCLUDED.hours,
        requirements = EXCLUDED.requirements,
        audience = EXCLUDED.audience,
        image = EXCLUDED.image,
        category_slug = EXCLUDED.category_slug,
        featured = EXCLUDED.featured,
        updated_at = now()
      RETURNING id
    `;

    const courseId = rows[0].id;

    await sql`DELETE FROM course_modalities WHERE course_id = ${courseId}`;
    for (const modSlug of course.modalitySlugs) {
      await sql`
        INSERT INTO course_modalities (course_id, modality_slug)
        VALUES (${courseId}, ${modSlug})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log('Seeding testimonials...');
  for (const t of testimonials) {
    await sql`
      INSERT INTO testimonials (name, position, company, content, rating, initials)
      VALUES (${t.name}, ${t.position}, ${t.company}, ${t.content}, ${t.rating}, ${t.initials})
      ON CONFLICT DO NOTHING
    `;
  }

  console.log('Seed complete!');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
