const db = require("../config/database");

const calcularSimulacao = (req, res) => {
    // 1. O país e os dados vêm do corpo da requisição
    const { idade, profissao, salario, paisDestino } = req.body;
    
    // 2. O ID do usuário agora vem direto e seguro do TOKEN validado pelo middleware!
    const userId = req.usuarioLogado.id;

    if (!idade || !profissao || !salario || !paisDestino) {
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos obrigatórios"
        });
    }

    // [O RESTO DO SEU CÓDIGO DO CONTROLLER CONTINUA IGUAL...]
    // Ele vai rodar a query no banco, calcular o score e salvar o histórico usando esse userId seguro.
    // 🔍 BUSCA O PAÍS DIRETO NO BANCO DE DADOS
    const queryPais = "SELECT * FROM countries WHERE nome = ?";
    
    db.get(queryPais, [paisDestino], (err, paisEncontrado) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar dados do país" });
        }

        if (!paisEncontrado) {
            return res.status(404).json({ success: false, message: "País destino não cadastrado no sistema" });
        }

        const { custo_vida, qualidade_vida, dificuldade } = paisEncontrado;

        // 🧠 ALGORITMO DE SCORE DINÂMICO
        // Exemplo: Se o salário do usuário for alto, reduz o peso do custo de vida
        let ajusteSalario = salario > 10000 ? 2 : 0;
        
        const scoreFinal = (qualidade_vida * 2) - (custo_vida + dificuldade) + ajusteSalario;
        
        let resultado = "Indefinido";
        if (scoreFinal >= 12) resultado = "Alta chance de adaptação";
        else if (scoreFinal >= 8) resultado = "Chance média";
        else resultado = "Baixa chance";

        const respostaDados = {
            paisDestino,
            custoVida: custo_vida,
            qualidadeVida: qualidade_vida,
            dificuldade,
            scoreFinal,
            resultado
        };

        // 💾 SALVA NO HISTÓRICO SE O USUÁRIO ESTIVER LOGADO (Passando o userId)
        if (userId) {
            const querySalvar = `
                INSERT INTO simulations (user_id, pais_destino, custo_vida, qualidade_vida, dade, score_final, resultado)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(querySalvar, [
                userId,
                paisDestino,
                custo_vida,
                qualidade_vida,
                dificuldade,
                scoreFinal,
                resultado
            ], function(err) {
                if (err) {
                    console.log("❌ Erro ao salvar histórico:", err);
                }
                
                // Retorna os dados + o ID da simulação salva
                return res.json({
                    success: true,
                    simulationId: this.lastID,
                    ...respostaDados
                });
            });
        } else {
            // Se for uma simulação anônima (sem login), apenas retorna o cálculo
            return res.json({
                success: true,
                ...respostaDados
            });
        }
    });
};

module.exports = {
    calcularSimulacao
};