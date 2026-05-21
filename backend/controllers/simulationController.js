const db = require("../config/database");

const calcularSimulacao = (req, res) => {
    // 1. Pega o país vindo do corpo da requisição de simulação
    const { paisDestino } = req.body;
    const usuarioLogado = req.usuarioLogado; // Injetado pelo verificarToken

    if (!paisDestino) {
        return res.status(400).json({
            success: false,
            message: "Por favor, selecione um país para simular."
        });
    }

    // 2. Faz o SELECT no banco SQLite buscando o país pelo nome de forma insensível a maiúsculas/minúsculas
    const query = "SELECT * FROM countries WHERE LOWER(nome) = LOWER(?)";

    db.get(query, [paisDestino], (err, row) => {
        if (err) {
            console.error("Erro ao consultar o banco:", err);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao processar a simulação."
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Dados deste país ainda não foram cadastrados no simulador."
            });
        }

        /* 3. LÓGICA DE SIMULAÇÃO MATEMÁTICA REAL
           Calcula o score de aproveitamento de 0 a 100%
           Fórmula balanceada: (Qualidade de Vida elevado / Custo e Dificuldade atenuados)
        */
        const pesoQualidade = row.qualidade_vida * 1.5;
        const pesoCusto = row.custo_vida * 0.8;
        const pesoDificuldade = row.dificuldade * 0.7;
        
        let scoreFinal = Math.round(((pesoQualidade * 10) / (pesoCusto + pesoDificuldade)) * 10);
        
        // Garante travas limites de margem de exibição percentual
        if (scoreFinal > 100) scoreFinal = 100;
        if (scoreFinal < 0) scoreFinal = 0;

        // Determinação de Diagnóstico Comportamental
        let resultadoTexto = "";
        if (scoreFinal >= 80) {
            resultadoTexto = "Altamente Recomendável! Excelente balanço entre qualidade e desenvolvimento.";
        } else if (scoreFinal >= 50) {
            resultadoTexto = "Viável, mas exige planejamento financeiro sólido e atenção aos custos.";
        } else {
            resultadoTexto = "Complexo. Barreiras imigratórias severas ou custo de vida desproporcional.";
        }

        // 4. Salva a simulação no Histórico do banco de dados (Opcional, mas amarra a tabela 'simulations')
        if (usuarioLogado && usuarioLogado.id) {
            const insereHistorico = `
                INSERT INTO simulations (user_id, pais_destino, custo_vida, qualidade_vida, dificuldade, score_final, resultado)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(insereHistorico, [usuarioLogado.id, row.nome, row.custo_vida, row.qualidade_vida, row.dificuldade, scoreFinal, resultadoTexto]);
        }

        // 5. Retorna a resposta limpa e mapeada perfeitamente com os ID's do Front-End
        return res.json({
            success: true,
            paisDestino: row.nome,
            custoVida: row.custo_vida,
            qualidadeVida: row.qualidade_vida,
            dificuldade: row.dificuldade,
            scoreFinal: scoreFinal,
            resultado: resultadoTexto
        });
    });
};

module.exports = {
    calcularSimulacao
};