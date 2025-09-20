# Configuración de MongoDB

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con la siguiente configuración:

```env
# MongoDB Connection String
```

### Opciones de MongoDB:

1. **MongoDB Local:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/interfaz-didactica
   ```

2. **MongoDB Atlas (Recomendado para producción):**
   ```env

   ```

## Estructura de la Base de Datos

### Colección: `leads`

Los leads se guardan con la siguiente estructura:

```typescript
{
  name: string;           // Requerido
  second_name?: string;   // Opcional
  cedula?: string;        // Opcional
  email: string;          // Requerido, único por fuente
  company?: string;       // Opcional
  phone?: string;         // Opcional
  interest?: string;      // Opcional: capacitacion, consultoria, liderazgo, evaluacion, cursos, otro
  message?: string;       // Opcional
  source: string;         // hero-form, cta-section, contact-page
  status: string;         // new, contacted, qualified, converted, closed
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### POST /api/leads

Guarda un nuevo lead en la base de datos.

**Body:**

```json
{
"name": "Juan Pérez",
"second_name": "Carlos",
"cedula": "12345678",
"email": "juan@empresa.com",
"company": "Mi Empresa",
"phone": "+1 555 123 4567",
"interest": "capacitacion",
"message": "Necesito información sobre capacitación",
"source": "hero-form"
}
```

**Respuesta exitosa:**

```json
{
"success": true,
"message": "Lead guardado exitosamente",
"leadId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

### GET /api/leads

Obtiene la lista de leads (para administración).

**Query parameters:**

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado

## Validaciones

- **Email único por fuente:** No se pueden crear leads duplicados con el mismo email desde la misma fuente
- **Validación de email:** Formato de email válido
- **Campos requeridos:** name y email son obligatorios
- **Límites de caracteres:**
  - name: máximo 100 caracteres
  - second_name: máximo 100 caracteres
  - cedula: máximo 20 caracteres
  - company: máximo 100 caracteres
  - phone: máximo 20 caracteres
  - message: máximo 1000 caracteres

## Índices

La base de datos incluye los siguientes índices para optimizar consultas:

- `email` (ascendente)
- `createdAt` (descendente)
- `status` (ascendente)
