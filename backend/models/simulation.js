// Aguarda a página carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("simulation-form"); // ID do seu <form> no HTML
    const resultadoDiv = document.getElementById("resultado-simulacao"); // ID da <div> onde mostrará o resultado

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede a página de recarregar

        // 1. Captura os dados dos inputs do seu HTML (ajuste os IDs se forem diferentes)
        const idade = document.getElementById("idade").value;
        const profissao = document.getElementById("profissao").value;
        const salario = document.getElementById("salario").value;
        const paisDestino = document.getElementById("paisDestino").value;

        // 2. Recupera o token JWT que o seu authController guardou no login
        const token = localStorage.getItem("token");

        if (!token) {
            alert("🔒 Você precisa estar logado para realizar uma simulação!");
            window.location.href = "login.html"; // Redireciona para o login caso não ache o token
            return;
        }

        // Monta o objeto exatamente como o seu back-end espera receber no req.body
        const dadosSimulacao = {
            idade: Number(idade),
            profissao,
            salario: Number(salario),
            paisDestino
        };

        try {
            // 3. Faz a chamada AJAX (Fetch) para o seu servidor Node.js
            const response = await fetch("http://localhost:3000/api/simular", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Envia o token para passar pelo verificarToken
                },
                body: JSON.stringify(dadosSimulacao)
            });

            const data = await response.json();

            // 4. Trata a resposta do servidor
            if (data.success) {
                // Renderiza o resultado bonitinho na tela
                resultadoDiv.innerHTML = `
                    <div style="background: #e2f0d9; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <h3>🌍 Resultado para: ${data.paisDestino}</h3>
                        <p><strong>Custo de Vida (Peso):</strong> ${data.custoVida}/10</p>
                        <p><strong>Qualidade de Vida (Peso):</strong> ${data.qualidadeVida}/10</p>
                        <p><strong>Dificuldade de Imigração:</strong> ${data.dificuldade}/10</p>
                        <p><strong>Score Final:</strong> ${data.scoreFinal}</p>
                        <hr>
                        <h4>📊 Diagnóstico: <span style="color: #385723;">${data.resultado}</span></h4>
                    </div>
                `;
            } else {
                alert(`⚠️ Erro na simulação: ${data.message}`);
            }

        } catch (error) {
            console.error("Erro ao conectar com a API:", error);
            alert("❌ O servidor está offline ou ocorreu um erro de conexão.");
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       LÓGICA DO SIMULADOR (PÓS-LOGIN)
       ========================================================================== */
    console.log("⚡ Script de simulação carregado e pronto.");

    // TODO: Quando você criar a tela oficial do simulador (dashboard), 
    // os seletores de elementos do formulário e a função de calcular os dados 
    // usando o Back-end (fetch) entrarão aqui.
});