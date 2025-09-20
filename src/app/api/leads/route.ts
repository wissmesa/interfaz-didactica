import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(request: NextRequest) {
try {
// Conectar a la base de datos
await connectDB();

// Parsear el cuerpo de la petición
const body = await request.json();

// Validar que los campos requeridos estén presentes
if (!body.name || !body.email) {
return NextResponse.json(
{
success: false,
error: 'Nombre y email son campos requeridos'
},
{ status: 400 }
);
}

// Validar formato de email
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
if (!emailRegex.test(body.email)) {
return NextResponse.json(
{
success: false,
error: 'Por favor ingresa un email válido'
},
{ status: 400 }
);
}

// Crear el nuevo lead
const lead = new Lead({
name: body.name.trim(),
second_name: body.second_name?.trim() || undefined,
cedula: body.cedula?.trim() || undefined,
email: body.email.trim().toLowerCase(),
company: body.company?.trim() || undefined,
phone: body.phone?.trim() || undefined,
interest: body.interest || undefined,
message: body.message?.trim() || undefined,
source: body.source || 'hero-form',
status: 'new'
});

// Guardar en la base de datos
const savedLead = await lead.save();

// Log para debugging (opcional)
console.log('Nuevo lead creado:', {
id: savedLead._id,
name: savedLead.name,
email: savedLead.email,
source: savedLead.source
});

return NextResponse.json(
{
success: true,
message: 'Lead guardado exitosamente',
leadId: savedLead._id
},
{ status: 201 }
);
} catch (error: any) {
console.error('Error al guardar lead:', error);

// Manejar errores específicos de MongoDB
if (error.code === 11000) {
return NextResponse.json(
{
success: false,
error: 'Ya existe un lead con este email desde esta fuente'
},
{ status: 409 }
);
}

// Manejar errores de validación
if (error.name === 'ValidationError') {
const validationErrors = Object.values(error.errors).map(
(err: any) => err.message
);
return NextResponse.json(
{
success: false,
error: 'Error de validación',
details: validationErrors
},
{ status: 400 }
);
}

return NextResponse.json(
{
success: false,
error: 'Error interno del servidor'
},
{ status: 500 }
);
}
}

// Endpoint para obtener leads (opcional, para administración)
export async function GET(request: NextRequest) {
try {
await connectDB();

const { searchParams } = new URL(request.url);
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '10');
const status = searchParams.get('status');

const query: any = {};
if (status) {
query.status = status;
}

const leads = await Lead.find(query)
.sort({ createdAt: -1 })
.limit(limit * 1)
.skip((page - 1) * limit)
.select('-__v');

const total = await Lead.countDocuments(query);

return NextResponse.json({
success: true,
leads,
pagination: {
page,
limit,
total,
pages: Math.ceil(total / limit)
}
});
} catch (error) {
console.error('Error al obtener leads:', error);
return NextResponse.json(
{
success: false,
error: 'Error interno del servidor'
},
{ status: 500 }
);
}
}
