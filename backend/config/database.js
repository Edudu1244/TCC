const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Aponta exatamente para a pasta database/database.db dentro do seu backend
const dbPath = path.resolve(__dirname, "../database/database.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("❌ Erro ao conectar banco:", err.message);
    } else {
        console.log("✅ Banco conectado");
    }
});

module.exports = db;
