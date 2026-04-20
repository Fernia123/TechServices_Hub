const nueva = await Solicitud.create({
  usuario_id: 5,
  servicio_id: 12,
  descripcion_detalle: 'Fuga en baño principal',
  fecha_programada: '2026-04-22T09:00:00',
  prioridad: 'alta',
  direccion: 'Av. Central 456'
});