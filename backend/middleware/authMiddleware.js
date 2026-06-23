const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Acesso negado. Faça login para realizar a simulação."
        });
    }

    try {
        const decodificado = jwt.verify(token, "segredo_super_secreto");
        req.usuarioLogado = decodificado;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Sua sessão expirou. Faça login novamente."
        });
    }
};

module.exports = verificarToken;