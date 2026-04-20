INSERT INTO solicitudes_servicio 
    (usuario_id, servicio_id, descripcion_detalle, fecha_programada, prioridad, direccion)
VALUES 
    (5, 12, 'Fuga de agua en baño principal', '2026-04-22 09:00:00', 'alta', 'Av. Central 456, Depto 3B')
RETURNING id; -- PostgreSQL. En MySQL usa SELECT LAST_INSERT_ID();