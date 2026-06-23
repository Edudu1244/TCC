const db = require("../config/database");

/* =========================
   BUSCAR USUÁRIO POR EMAIL
========================= */
const findUserByEmail = (email, callback) => {
    const query = `
        SELECT * FROM users 
        WHERE email = ?
    `;
    db.get(query, [email], callback);
};

/* =========================
   CRIAR USUÁRIO
========================= */
const createUser = (userData, callback) => {
    const {
        nome,
        idade,
        sexo,
        profissao,
        pais,
        email,
        senha
    } = userData;

    const query = `
        INSERT INTO users (
            nome,
            idade,
            sexo,
            profissao,
            pais,
            email,
            senha
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Usamos uma function tradicional no callback interno para capturar o "this.lastID" do SQLite
    db.run(
        query,
        [nome, idade, sexo, profissao, pais, email, senha],
        function (err) {
            if (err) {
                return callback(err, null);
            }
            // Retorna o erro (null) e o ID gerado pelo banco para o Controller
            callback(null, this.lastID);
        }
    );
};

module.exports = {
    findUserByEmail,
    createUser
};