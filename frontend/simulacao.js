document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    const formSimulacao = document.getElementById("formSimulacao");
    const nomeUsuarioField = document.getElementById("nomeUsuario");
    const btnDesconectar = document.getElementById("btnDesconectar");
    const themeToggle = document.getElementById("themeToggle");
    const msgStatus = document.getElementById("msgStatus");

     // ==========================================================
    // SISTEMA DE TEMA AUTOMÁTICO (INVISÍVEL)
    // ==========================================================
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
    }


    /* ==========================================================
       1. TRAVA DE SEGURANÇA (OBRIGATÓRIO ESTAR LOGADO)
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
       2. REQUISIÇÃO VIA POST PARA O MOTOR DE SIMULAÇÃO DO BACKEND
       ========================================================== */
    if (formSimulacao) {
        formSimulacao.addEventListener("submit", async (e) => {
            e.preventDefault();

            const paisSelecionado = document.getElementById("paisDestino").value;

            // Elementos de injeção visual do Dashboard
            const resCusto = document.getElementById("resCusto");
            const resSalario = document.getElementById("resSalario"); // Representa o peso da qualidade salarial
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
                // Alinhado para disparar um POST para /api/simular
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
                    // Atualiza a mensagem de status com o Diagnóstico Textual do Backend
                    msgStatus.innerText = `Diagnóstico: ${data.resultado}`;
                    msgStatus.style.color = "#6bff95";
                    
                    // Alimenta os cards com as notas retornadas do banco SQLite
                    resCusto.innerText = `${data.custoVida} / 10`;
                    resSalario.innerText = `${Math.round(data.qualidadeVida * 1.2)} / 10`; // Estimativa salarial baseada em qualidade
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

    /* ==========================================================
       3. LOGOUT (DESCONECTAR)
       ========================================================== */
    if (btnDesconectar) {
        btnDesconectar.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "inicial.html";
        });
    }

    /* ==========================================================
       4. DARK MODE (SINCRONIZADO)
       ========================================================== */
    if (themeToggle) {
        const temaSalvo = localStorage.getItem("tema");
        if (temaSalvo === "dark") {
            document.body.classList.add("dark");
            themeToggle.textContent = "☀️";
        }
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const darkAtivo = document.body.classList.contains("dark");
            themeToggle.textContent = darkAtivo ? "☀️" : "🌙";
            localStorage.setItem("tema", darkAtivo ? "dark" : "light");
        });
    }
});