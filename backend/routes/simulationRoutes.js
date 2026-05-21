const express = require("express");
const router = express.Router();

// 1. Importa a função do arquivo controller
const { calcularSimulacao } = require("../controllers/simulationController");

// 2. Importa o middleware de segurança (JWT)
// Nota: Certifique-se de que o arquivo 'authMiddleware.js' está na pasta 'middleware'
const verificarToken = require("../middleware/authMiddleware");

// 3. Define a rota da simulação protegida pelo token
// Quando o front-end disparar um POST para /api/simular, o Express vai:
// -> Executar o verificarToken para checar o login
// -> Se estiver tudo ok, executar o calcularSimulacao
router.post("/simular", verificarToken, calcularSimulacao);

// 4. Exporta o roteador para o seu server.js conseguir ler
module.exports = router;