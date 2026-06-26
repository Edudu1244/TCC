const express = require("express");
const cors = require("cors");
const db = require("./config/database");

// 1. IMPORTAÇÃO DAS ROTAS
const authRoutes = require("./routes/authRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

const verificarToken = require("./middleware/authMiddleware");

const app = express();
const PORT = 3000;

// 2. MIDDLEWARES GERAIS
app.use(cors());
app.use(express.json());

// 3. DEFINIÇÃO DAS ROTAS DA API
app.use("/auth", authRoutes); 
app.use("/api", simulationRoutes);

// 4. ROTA INICIAL DE TESTE
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando!");
});

// 5. BANCO DE DADOS (Criação e população das tabelas dentro do serialize)
db.serialize(() => {
    // Tabela de Usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER NOT NULL,
            sexo TEXT NOT NULL,
            profissao TEXT NOT NULL,
            pais TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `);

    // Tabela de Países
    db.run(`
        CREATE TABLE IF NOT EXISTS countries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE NOT NULL,
            custo_vida INTEGER NOT NULL,
            qualidade_vida INTEGER NOT NULL,
            dificuldade INTEGER NOT NULL
        )
    `, () => {
        db.get("SELECT COUNT(*) as total FROM countries", (err, row) => {
            if (!err && row.total === 0) {
                const stmt = db.prepare("INSERT INTO countries (nome, custo_vida, qualidade_vida, dificuldade) VALUES (?, ?, ?, ?)");
                stmt.run("Canadá", 8, 9, 6);
                stmt.run("Portugal", 6, 7, 4);
                stmt.run("Estados Unidos", 9, 8, 8);
                stmt.finalize();
                console.log("ℹ️ Tabela de países populada com sucesso!");
            }
        });
    });

    // Tabela de Histórico de Simulações
    db.run(`
        CREATE TABLE IF NOT EXISTS simulations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            pais_destino TEXT NOT NULL,
            custo_vida INTEGER NOT NULL,
            qualidade_vida INTEGER NOT NULL,
            dificuldade INTEGER NOT NULL,
            score_final INTEGER NOT NULL,
            resultado TEXT NOT NULL,
            data_simulacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);
});

app.get("/api/perfil", verificarToken, (req, res) => {
    // 🌟 Pegando os dados do lugar correto que o seu middleware definiu:
    console.log("➡️ O que tem no token:", req.usuarioLogado);
    
    // Captura o ID de dentro do usuarioLogado
    const userId = req.usuarioLogado.id || req.usuarioLogado.userId || req.usuarioLogado.user_id; 

    console.log("➡️ ID que vai pro banco:", userId);

    db.get("SELECT nome, idade, sexo, profissao, email FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro no banco." });
        }
        
        console.log("➡️ Linha encontrada:", row);

        if (!row) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }
        
        res.json({ success: true, usuario: row });
    });
});
// ==========================================
// INICIANDO O SERVIDOR
// ==========================================
app.listen(3000, () => {
    console.log("✅ Servidor rodando em http://localhost:3000");
});