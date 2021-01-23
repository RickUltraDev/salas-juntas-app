/* Imports necesarios */
const express = require('express');
const router = express.Router();

/* Controller */
const salaController = require('../controllers/salaController');

/* Rutas registradas */
router.get("/", salaController.getSalas);
router.get("/:idSala", salaController.getSala);
router.post("/registro", salaController.registrarSala);
router.delete("/elimina/:idSala",salaController.eliminarSala);
router.put("/actualiza/:idSala",salaController.actualizarSala);

module.exports = router;