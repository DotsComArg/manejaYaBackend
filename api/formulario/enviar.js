const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Endpoint de prueba para verificar que el backend funciona
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Backend maneja ya funcionando',
      status: 'OK',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const {
      origen,
      nombre,
      apellidos,
      email,
      telefono,
      ciudad,
      codigo_postal,
      colonia,
      asunto,
      mensaje
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellidos || !email || !telefono || !ciudad || !codigo_postal || !colonia || !asunto || !mensaje || !origen) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Formato de email inválido' 
      });
    }

    // Configurar transporter de Nodemailer
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true para puerto 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Configurar el email
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje desde ${origen} - ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #4a4a3a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">Nuevo mensaje desde ${origen}</h2>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f0; border-radius: 6px; border-left: 4px solid #4a4a3a;">
              <h3 style="margin: 0 0 10px 0; color: #2c2c2c;">Información del contacto</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Nombre:</strong> ${nombre} ${apellidos}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Teléfono:</strong> ${telefono}</p>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f0; border-radius: 6px; border-left: 4px solid #4a4a3a;">
              <h3 style="margin: 0 0 10px 0; color: #2c2c2c;">Información de ubicación</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Ciudad:</strong> ${ciudad}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Código Postal:</strong> ${codigo_postal}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Colonia:</strong> ${colonia}</p>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f0; border-radius: 6px; border-left: 4px solid #4a4a3a;">
              <h3 style="margin: 0 0 10px 0; color: #2c2c2c;">Mensaje</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Asunto:</strong> ${asunto}</p>
              <div style="margin-top: 15px; padding: 15px; background-color: white; border-radius: 4px; border: 1px solid #ddd;">
                <p style="margin: 0; color: #333; line-height: 1.6;">${mensaje.replace(/\n/g, '<br>')}</p>
              </div>
            </div>

            <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 6px; text-align: center;">
              <p style="margin: 0; color: #2c2c2c; font-size: 14px;">
                <strong>Origen del formulario:</strong> ${origen}<br>
                <strong>Fecha:</strong> ${new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' })}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Nuevo mensaje desde ${origen}
        
        INFORMACIÓN DEL CONTACTO:
        Nombre: ${nombre} ${apellidos}
        Email: ${email}
        Teléfono: ${telefono}
        
        INFORMACIÓN DE UBICACIÓN:
        Ciudad: ${ciudad}
        Código Postal: ${codigo_postal}
        Colonia: ${colonia}
        
        MENSAJE:
        Asunto: ${asunto}
        Mensaje: ${mensaje}
        
        Origen del formulario: ${origen}
        Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' })}
      `
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    // Respuesta exitosa
    res.status(200).json({ 
      message: 'Mensaje enviado correctamente',
      success: true 
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    
    // Respuesta de error
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      success: false 
    });
  }
}
