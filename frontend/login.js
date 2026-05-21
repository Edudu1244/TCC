document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const mensagem = document.getElementById("mensagem");

    // ==========================================================
    // SISTEMA DE TEMA AUTOMÁTICO (INVISÍVEL)
    // ==========================================================
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
    }

    // ==========================================================
    // ENVIO DO FORMULÁRIO DE LOGIN (FETCH)
    // ==========================================================
    if (formLogin) {
        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (!email || !senha) {
                mensagem.innerText = "Por favor, preencha todos os campos.";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            try {
                const resposta = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await resposta.json();

                if (resposta.ok && data.success) {
                    mensagem.innerText = "Login realizado com sucesso! Redirecionando...";
                    mensagem.style.color = "#6bff95";

                    // Salva as credenciais recebidas do backend para validar as simulações
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("usuario", JSON.stringify(data.user));

                    setTimeout(() => {
                        window.location.href = "simulacao.html";
                    }, 1500);
                } else {
                    mensagem.innerText = data.message || "E-mail ou senha incorretos.";
                    mensagem.style.color = "#ff6b6b";
                }

            } catch (erro) {
                mensagem.innerText = "Não foi possível conectar ao servidor.";
                mensagem.style.color = "#ff6b6b";
                console.error("Erro no processo de login:", erro);
            }
        });
    }
});