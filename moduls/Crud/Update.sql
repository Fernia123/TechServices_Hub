-- Cambiar estado y registrar en historial (recomendado usar transacción)
BEGIN;

UPDATE solicitudes_servicio 
SET estado = 'en_proceso', 
    fecha_completada = NULL,
    actualizado_en = CURRENT_TIMESTAMP
WHERE id = 101 AND eliminado = FALSE;

INSERT INTO historial_estados (solicitud_id, estado_anterior, estado_nuevo, usuario_modificador_id, observacion)
VALUES (101, 'pendiente', 'en_proceso', 8, 'Técnico en ruta');

COMMIT;