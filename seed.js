const { Usuario, Servicio } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('🌱 Iniciando siembra de datos...');

    // 1. Crear Usuario Admin
    const passHash = await bcrypt.hash('admin123', 12);
    const [user, createdUser] = await Usuario.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        nombre: 'Administrador',
        rol: 'admin',
        contrasena_hash: passHash,
        activo: true
      }
    });

    if (createdUser) console.log('✅ Usuario admin creado (admin@test.com / admin123)');
    else console.log('ℹ️ El usuario admin ya existía.');

    // 2. Crear Servicios de prueba
    const servicios = [
      {
        nombre: 'Mantenimiento de PC',
        descripcion: 'Limpieza física, cambio de pasta térmica y optimización de software.',
        precio: 45.00,
        categoria: 'Soporte Técnico'
      },
      {
        nombre: 'Configuración de Redes',
        descripcion: 'Instalación de routers, repetidores y configuración de redes WiFi seguras.',
        precio: 60.50,
        categoria: 'Redes'
      }
    ];

    for (const s of servicios) {
      const [ser, createdSer] = await Servicio.findOrCreate({
        where: { nombre: s.nombre },
        defaults: s
      });
      if (createdSer) console.log(`✅ Servicio creado: ${s.nombre}`);
    }

    console.log('✨ Proceso de siembra completado.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en la siembra:', err);
    process.exit(1);
  }
}

seed();
