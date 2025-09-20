import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
name: string;
second_name?: string;
cedula?: string;
email: string;
company?: string;
phone?: string;
interest?: string;
message?: string;
source: 'hero-form' | 'cta-section' | 'contact-page';
status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
createdAt: Date;
updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
{
name: {
type: String,
required: [true, 'El nombre es requerido'],
trim: true,
maxlength: [100, 'El nombre no puede exceder 100 caracteres']
},
second_name: {
type: String,
trim: true,
maxlength: [100, 'El segundo nombre no puede exceder 100 caracteres']
},
cedula: {
type: String,
trim: true,
maxlength: [20, 'La cédula no puede exceder 20 caracteres']
},
email: {
type: String,
required: [true, 'El email es requerido'],
trim: true,
lowercase: true,
match: [
/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
'Por favor ingresa un email válido'
]
},
company: {
type: String,
trim: true,
maxlength: [100, 'El nombre de la empresa no puede exceder 100 caracteres']
},
phone: {
type: String,
trim: true,
maxlength: [20, 'El teléfono no puede exceder 20 caracteres']
},
interest: {
type: String,
enum: [
'capacitacion',
'consultoria',
'liderazgo',
'evaluacion',
'cursos',
'otro'
]
},
message: {
type: String,
trim: true,
maxlength: [1000, 'El mensaje no puede exceder 1000 caracteres']
},
source: {
type: String,
enum: ['hero-form', 'cta-section', 'contact-page'],
default: 'hero-form'
},
status: {
type: String,
enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
default: 'new'
}
},
{
timestamps: true
}
);

// Índices para optimizar consultas
LeadSchema.index({ email: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });

// Crear el modelo
const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

// Middleware para validar email único por fuente
LeadSchema.pre('save', async function (next) {
if (this.isNew) {
const existingLead = await Lead.findOne({
email: this.email,
source: this.source
});

if (existingLead) {
const error = new Error('Ya existe un lead con este email desde esta fuente');
return next(error);
}
}
next();
});

export default Lead;
