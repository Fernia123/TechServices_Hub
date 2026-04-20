-- Borrado lógico (mantiene integridad y auditoría)
UPDATE solicitudes_servicio 
SET eliminado = TRUE, actualizado_en = CURRENT_TIMESTAMP
WHERE id = 101;

-- Si necesitas borrado físico (solo para datos de prueba o cumplimiento legal):
-- DELETE FROM solicitudes_servicio WHERE id = 101;