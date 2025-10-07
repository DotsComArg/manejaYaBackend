# Maneja Ya - Backend para Formularios

Backend desplegado en Vercel para el manejo de formularios de contacto de Maneja Ya.

## Configuración de Variables de Entorno en Vercel

Para que el backend funcione correctamente, necesitas configurar las siguientes variables de entorno en tu proyecto de Vercel:

### Variables Requeridas

```bash
# Configuración SMTP de Ionos
SMTP_HOST=smtp.ionos.mx
SMTP_PORT=25
SMTP_USER=info@manejaya.com
SMTP_PASS=tu_contraseña_aqui
SMTP_FROM_NAME=Maneja Ya
SMTP_TO_EMAIL=info@manejaya.com

# Configuración del entorno
NODE_ENV=production
```

### Cómo configurar las variables en Vercel:

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable con su valor correspondiente
5. Asegúrate de que estén habilitadas para **Production**

### Estructura del Proyecto

```
├── api/
│   └── formulario/
│       └── enviar.js          # Endpoint principal
├── formulario-inicio.html     # Formulario desde inicio
├── formulario-contacto.html   # Formulario desde contacto
├── formulario-inscribirme.html # Formulario desde inscripción
├── package.json
├── vercel.json
└── README.md
```

### Endpoint API

**POST** `/api/formulario/enviar`

Recibe los siguientes campos:
- `origen` (string): "Desde inicio", "Desde contacto", "Desde inscribirme"
- `nombre` (string): Nombre del usuario
- `apellidos` (string): Apellidos del usuario
- `email` (string): Email del usuario
- `telefono` (string): Teléfono del usuario
- `ciudad` (string): Ciudad seleccionada
- `codigo_postal` (string): Código postal
- `colonia` (string): Colonia
- `asunto` (string): Asunto del mensaje
- `mensaje` (string): Mensaje del usuario

### Respuestas

**Éxito (200):**
```json
{
  "message": "Mensaje enviado correctamente",
  "success": true
}
```

**Error (400/500):**
```json
{
  "message": "Descripción del error",
  "success": false
}
```

### Despliegue

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. El despliegue se realizará automáticamente

### Características

- ✅ Validación de campos requeridos
- ✅ Validación de formato de email
- ✅ Email HTML con diseño profesional
- ✅ CORS configurado
- ✅ Manejo de errores
- ✅ Logging para debugging
- ✅ Timezone de Monterrey
- ✅ Reply-to configurado para responder directamente al usuario

### Notas Importantes

- El puerto 25 puede requerir configuración adicional en algunos proveedores
- Si tienes problemas con el puerto 25, también puedes probar con el puerto 587
- Asegúrate de que la contraseña del email esté configurada correctamente
- El email se envía desde `info@manejaya.com` hacia `info@manejaya.com` (puedes cambiar el destinatario si es necesario)
