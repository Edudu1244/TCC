document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    const formSimulacao = document.getElementById("formSimulacao");
    const nomeUsuarioField = document.getElementById("nomeUsuario");
    const msgStatus = document.getElementById("msgStatus");
    
    /* ==========================================================
       1. VERIFICAÇÃO AUTOMÁTICA DO TEMA SALVO (SEM BOTÃO)
       ========================================================== */
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
    }

    /* ==========================================================
       2. TRAVA DE SEGURANÇA (OBRIGATÓRIO ESTAR LOGADO)
       ========================================================== */
    if (!token) {
        alert("🔒 Acesso negado! Por favor, faça login para acessar o simulador.");
        window.location.href = "login.html";
        return; 
    }

    if (usuarioSalvo && nomeUsuarioField) {
        const usuarioObj = JSON.parse(usuarioSalvo);
        if (usuarioObj && usuarioObj.nome) {
            nomeUsuarioField.innerText = usuarioObj.nome.split(" ")[0];
        }
    }

    /* ==========================================================
       3. REQUISIÇÃO VIA POST PARA O MOTOR DE SIMULAÇÃO
       ========================================================== */
    if (formSimulacao) {
        formSimulacao.addEventListener("submit", async (e) => {
            e.preventDefault();

            const paisSelecionado = document.getElementById("paisDestino").value;

            const resCusto = document.getElementById("resCusto");
            const resSalario = document.getElementById("resSalario"); 
            const resQualidade = document.getElementById("resQualidade");
            const resMigracao = document.getElementById("resMigracao");
            const resScore = document.getElementById("resScore");

            if(!paisSelecionado) {
                alert("Por favor, selecione um país válido.");
                return;
            }

            msgStatus.innerText = "Processando variáveis no servidor...";
            msgStatus.style.color = "#7fb0ff";

            try {
                const response = await fetch("http://localhost:3000/api/simular", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ paisDestino: paisSelecionado })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    msgStatus.innerText = `Diagnóstico: ${data.resultado}`;
                    msgStatus.style.color = "#6bff95";
                    
                    resCusto.innerText = `${data.custoVida} / 10`;
                    resSalario.innerText = `${Math.round(data.qualidadeVida * 1.2)} / 10`; 
                    resQualidade.innerText = `${data.qualidadeVida} / 10`;
                    resMigracao.innerText = `${data.dificuldade} / 10`;
                    resScore.innerText = `${data.scoreFinal}%`;

                } else {
                    msgStatus.innerText = data.message || "Não foi possível processar os dados.";
                    msgStatus.style.color = "#ff6b6b";
                }

            } catch (error) {
                console.error("Erro ao conectar à API de simulação:", error);
                msgStatus.innerText = "O servidor está offline ou houve falha na conexão.";
                msgStatus.style.color = "#ff6b6b";
            }
        });
    }
});