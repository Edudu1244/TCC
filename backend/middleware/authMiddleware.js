const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    // Busca o token enviado no cabeçalho Authorization
    const authHeader = req.headers["authorization"];
    
    // O padrão de envio é "Bearer TOKEN", então dividimos a string para pegar só o token
    const token = authHeader && authHeader.split(" ")[1];

    // Se o token não existir, barra a requisição na hora
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Acesso negado. Faça login para realizar a simulação."
        });
    }

    try {
        // Valida o token com a chave secreta que você definiu no generateToken
        const decodificado = jwt.verify(token, "segredo_super_secreto");
        
        // Injeta os dados extraídos do token (id e email) dentro do objeto req
        req.usuarioLogado = decodificado;

        // Passa o bastão para a próxima função (o Controller)
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Sua sessão expirou. Faça login novamente."
        });
    }
};

module.exports = verificarToken;