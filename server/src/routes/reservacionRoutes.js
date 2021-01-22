/* Imports necesarios */
const express = require('express');
const router = express.Router();

/* Controller */
const reservacionController = require('../controllers/reservacionController');

/* Rutas registradas */
router.get("/", reservacionController.getReservaciones);
router.get("/:idReservacion", reservacionController.getReservacion);
router.post("/registro", reservacionController.registrarReservacion);
router.delete("/elimina/:idReservacion",reservacionController.eliminarReservacion);
router.put("/actualiza/:idReservacion",reservacionController.actualizarReservacion);


module.exports = router;