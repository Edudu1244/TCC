const express = require("express");
const router = express.Router();
const { calcularSimulacao } = require("../controllers/simulationController");
const verificarToken = require("../middleware/authMiddleware");

// POST /api/simular protegido pelo Token JWT
router.post("/simular", verificarToken, calcularSimulacao);

module.exports = router;