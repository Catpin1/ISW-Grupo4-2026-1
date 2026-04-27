const { Router } = require('express');
const router = Router();

// Importar rutas
const PersonaRoutes = require('./Persona.routes.js');
const AsistenciaRoutes = require('./Asistencia.routes.js');
const ClaseRoutes = require('./Clase.routes.js');
const EvaluacionPracticaRoutes = require('./EvaluacionPractica.routes.js');
const EvaluacionTeoricaRoutes = require('./EvaluacionTeorica.routes.js');
const PlanRoutes = require('./Routes.routes.js');
const SalaRoutes = require('./Sala.routes.js');
const VehiculoRoutes = require('./Vehiculo.routes.js');


router.get('/', (req, res) => {
    res.json({ message: "Bienvenido a la API" });
});


router.use('/Persona', PersonaRoutes);
router.use('/Asistencia', AsistenciaRoutes);
router.use('/Clase', ClaseRoutes);
router.use('/EvaluacionPractica', EvaluacionPracticaRoutes);
router.use('/EvaluacionTeorica', EvaluacionTeoricaRoutes);
router.use('/Plan', PlanRoutes);
router.use('/Sala', SalaRoutes);
router.use('/Vehiculo', VehiculoRoutes);


module.exports = router;