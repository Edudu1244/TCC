const express = require("express");
const router = express.Router();
const { calcularSimulacao } = require("../controllers/simulationController");
const verificarToken = require("../middleware/authMiddleware");

// 1. ROTA PÚBLICA (Coloque no topo! Sem o verificarToken)
router.get("/paises", (req, res) => {
    const db = require("../config/database");
    db.all("SELECT nome FROM countries ORDER BY nome ASC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar países." });
        }
        res.json({ success: true, paises: rows });
    });
});

// 2. ROTA PROTEGIDA (Esta sim precisa de token)
router.post("/simular", verificarToken, calcularSimulacao);

module.exports = router;