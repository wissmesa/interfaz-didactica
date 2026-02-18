import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seedAdmin() {
  const email = process.argv[2] || 'admin@interfazdidactica.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Administrador';

  console.log(`Creating admin user: ${email}`);

  const hash = await bcrypt.hash(password, 12);

  try {
    const rows = await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES (${email}, ${hash}, ${name})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}, name = ${name}
      RETURNING id, email, name
    `;

    console.log('Admin user created:', rows[0]);
    console.log(`\nLogin credentials:\n  Email: ${email}\n  Password: ${password}`);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

seedAdmin();
