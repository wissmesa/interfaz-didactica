import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const companies: { name: string; logoFile: string | null; sortOrder: number }[] = [
  { name: 'Fundación Empresas Polar', logoFile: 'empresas-polar.png', sortOrder: 1 },
  { name: 'Alimentos Mary', logoFile: 'alimentos-mary.png', sortOrder: 2 },
  { name: 'Banco Microfinanciero R4', logoFile: null, sortOrder: 3 },
  { name: 'Laboratorios Farma', logoFile: 'laboratorios-farma.png', sortOrder: 4 },
  { name: 'Banesco', logoFile: null, sortOrder: 5 },
  { name: 'Todoticket', logoFile: 'todoticket.png', sortOrder: 6 },
  { name: 'Fundación Badán', logoFile: null, sortOrder: 7 },
  { name: 'Club Bahía de los Piratas', logoFile: null, sortOrder: 8 },
  { name: 'Alfonzo Rivas', logoFile: 'alfonzo-rivas.png', sortOrder: 9 },
  { name: 'Corporación Digitel', logoFile: 'digitel.png', sortOrder: 10 },
  { name: 'Ponzi & Benzo', logoFile: null, sortOrder: 11 },
  { name: 'Citibank', logoFile: 'citibank.png', sortOrder: 12 },
  { name: 'Cencozotti', logoFile: null, sortOrder: 13 },
  { name: 'Hotel Tamanaco', logoFile: null, sortOrder: 14 },
  { name: 'Hotel Marriott', logoFile: 'marriott.png', sortOrder: 15 },
  { name: 'Grupo Cordialito', logoFile: null, sortOrder: 16 },
  { name: 'Indecem', logoFile: null, sortOrder: 17 },
  { name: 'Kimberly Clark', logoFile: 'kimberly-clark.png', sortOrder: 18 },
  { name: 'Laboratorio Kleenox', logoFile: null, sortOrder: 19 },
  { name: 'Makro Comercializadora', logoFile: null, sortOrder: 20 },
  { name: 'Mercantil Seguros', logoFile: 'mercantil-seguros.png', sortOrder: 21 },
  { name: 'Ovejita', logoFile: null, sortOrder: 22 },
  { name: 'Muebles Bima', logoFile: null, sortOrder: 23 },
  { name: 'Pollos Arturo\'s', logoFile: null, sortOrder: 24 },
  { name: 'Pernod Ricard', logoFile: 'pernod-ricard.png', sortOrder: 25 },
  { name: 'Robert Bosch', logoFile: 'robert-bosch.png', sortOrder: 26 },
  { name: 'Seguros Caracas', logoFile: null, sortOrder: 27 },
  { name: 'Seguros Nuevo Mundo', logoFile: null, sortOrder: 28 },
  { name: 'Venemergencia', logoFile: 'venemergencia.png', sortOrder: 29 },
  { name: 'Zurich Seguros', logoFile: 'zurich-seguros.png', sortOrder: 30 },
  { name: 'Farmatodo', logoFile: 'farmatodo.png', sortOrder: 31 },
  { name: 'Supermercados Plaza\'s', logoFile: null, sortOrder: 32 },
  { name: 'Excelsior Gama', logoFile: null, sortOrder: 33 },
  { name: 'Bonsai Sushi', logoFile: null, sortOrder: 34 },
  { name: 'Rolda', logoFile: 'rolda.png', sortOrder: 35 },
  { name: 'Perfumes Factory', logoFile: null, sortOrder: 36 },
  { name: 'Duncan', logoFile: null, sortOrder: 37 },
  { name: 'Laboratorios Vargas', logoFile: 'laboratorios-vargas.png', sortOrder: 38 },
  { name: 'Ferretotal', logoFile: null, sortOrder: 39 },
];

async function seed() {
  console.log(`Insertando ${companies.length} empresas...\n`);

  let inserted = 0;
  let skipped = 0;

  for (const company of companies) {
    const logoUrl = company.logoFile ? `/images/empresas/${company.logoFile}` : null;

    const existing = await sql`
      SELECT id FROM partner_companies WHERE LOWER(name) = LOWER(${company.name})
    `;

    if (existing.length > 0) {
      console.log(`  ⏭  ${company.name} (ya existe)`);
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO partner_companies (name, logo_url, active, sort_order)
      VALUES (${company.name}, ${logoUrl}, true, ${company.sortOrder})
    `;

    const logoStatus = logoUrl ? '🖼️' : '📝';
    console.log(`  ${logoStatus} ${company.name}`);
    inserted++;
  }

  console.log(`\n✅ Seed completado: ${inserted} insertadas, ${skipped} ya existían`);
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
