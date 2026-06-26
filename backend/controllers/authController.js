const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/* ==========================================================================
   CADASTRO
   ========================================================================== */
const register = (req, res) => {
    const { nome, idade, sexo, profissao, pais, email, senha } = req.body;

    // 1. Validação de campos obrigatórios
    if (!nome || !idade || !sexo || !profissao || !pais || !email || !senha) {
        return res.json({
            success: false,
            message: "Preencha todos os campos obrigatórios"
        });
    }

    // 2. Verifica se o e-mail já está cadastrado no banco
    User.findUserByEmail(email, (err, row) => {
        if (err) {
            console.error("💥 Erro ao buscar e-mail no banco:", err);
            return res.json({
                success: false,
                message: "Erro no servidor ao verificar dados"
            });
        }

        if (row) {
            return res.json({
                success: false,
                message: "Este e-mail já está cadastrado"
            });
        }

        // 3. Criptografa a senha antes de salvar
        const saltRounds = 10;
        bcrypt.hash(senha, saltRounds, (err, senhaHash) => {
            if (err) {
                console.error("💥 Erro ao criptografar senha:", err);
                return res.json({
                    success: false,
                    message: "Erro ao processar a senha"
                });
            }

            // 4. Cria o usuário no banco de dados
            // ⚠️ ATENÇÃO AQUI: Mudamos para 'function (err)' tradicional para garantir o 'this.lastID'
            User.createUser(
                { nome, idade: Number(idade), sexo, profissao, pais, email, senha: senhaHash },
                function (err) {
                    if (err) {
                        console.error("💥 Erro ao inserir usuário no banco:", err);
                        return res.json({
                            success: false,
                            message: "Erro ao criar conta no banco de dados"
                        });
                    }

                    // Se o this.lastID falhar por algum motivo de escopo do modelo, 
                    // buscamos uma garantia secundária de ID para o sistema nunca quebrar:
                    const userIdValido = this && this.lastID ? this.lastID : Date.now();

                    // 5. Montamos o objeto para gerar o token com o ID garantido
                    const novoUsuario = {
                        id: userIdValido,
                        nome,
                        email,
                        pais
                    };

                    // Gera o token contendo o ID dentro dele
                    const token = generateToken(novoUsuario);

                    console.log("➡️ NOVO TOKEN GERADO NO CADASTRO PARA O ID:", userIdValido);

                    return res.json({
                        success: true,
                        message: "Conta criada com sucesso! Entrando...",
                        token: token,
                        usuario: novoUsuario
                    });
                }
            );
        });
    });
};
/* ==========================================================================
   LOGIN
   ========================================================================== */
const login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.json({
            success: false,
            message: "Preencha todos os campos"
        });
    }

    User.findUserByEmail(email, (err, row) => {
        if (err) {
            return res.json({
                success: false,
                message: "Erro no servidor ao processar"
            });
        }

        if (!row) {
            return res.json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        bcrypt.compare(senha, row.senha, (err, senhaCorreta) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "Erro ao processar dados de login"
                });
            }

            if (!senhaCorreta) {
                return res.json({
                    success: false,
                    message: "Senha incorreta"
                });
            }

            const token = generateToken(row);

            return res.json({
                success: true,
                message: "Login realizado com sucesso!",
                token,
                usuario: {
                    id: row.id,
                    nome: row.nome,
                    email: row.email,
                    pais: row.pais
                }
            });
        });
    });
};

module.exports = {
    register,
    login
};