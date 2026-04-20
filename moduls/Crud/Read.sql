-- Listar solicitudes activas de un cliente con detalles
SELECT 
    s.id AS ticket,
    u.nombre AS cliente,
    ser.nombre AS servicio,
    s.estado,
    s.prioridad,
    s.fecha_programada,
    a.tecnico_id,
    u2.nombre AS tecnico_asignado
FROM solicitudes_servicio s
JOIN usuarios u ON s.usuario_id = u.id
JOIN servicios ser ON s.servicio_id = ser.id
LEFT JOIN asignaciones a ON s.id = a.solicitud_id AND a.estado_asignacion IN ('aceptada','completada')
LEFT JOIN usuarios u2 ON a.tecnico_id = u2.id
WHERE s.eliminado = FALSE
  AND s.usuario_id = 5
ORDER BY s.fecha_solicitada DESC;