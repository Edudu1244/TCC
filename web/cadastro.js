// cadastro.js
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTOS
    ========================= */
    const formCadastro = document.getElementById("formCadastro"); // 🔥 Mudado para escutar o formulário
    const mensagem = document.getElementById("mensagem");
    const themeToggle = document.getElementById("themeToggle");

    /* =========================
       CADASTRO
    ========================= */
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (event) => {
            event.preventDefault(); // 🔥 Evita o recarregamento automático da página

            const dados = {
                nome: document.getElementById("nome").value.trim(),
                idade: Number(document.getElementById("idade").value.trim()), // Garante que vai como número
                sexo: document.getElementById("sexo").value,
                profissao: document.getElementById("profissao").value.trim(),
                pais: document.getElementById("pais").value,
                email: document.getElementById("email").value.trim(),
                senha: document.getElementById("senha").value.trim()
            };

            /* =========================
               VALIDAÇÃO
            ========================= */
            if (
                !dados.nome ||
                !dados.idade ||
                !dados.profissao ||
                !dados.email ||
                !dados.senha
            ) {
                mensagem.innerHTML = "Preencha todos os campos obrigatórios";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            if (!dados.email.includes("@")) {
                mensagem.innerHTML = "Digite um email válido";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            if (dados.senha.length < 6) {
                mensagem.innerHTML = "A senha deve ter no mínimo 6 caracteres";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            /* =========================
               ENVIO PARA SERVIDOR
            ========================= */
            try {
                const resposta = await fetch("http://localhost:3000/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const data = await resposta.json();

                if (data.success) {
                    mensagem.innerHTML = "Conta criada com sucesso!";
                    mensagem.style.color = "#6bff95";

                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);

                } else {
                    mensagem.innerHTML = data.message || "Erro ao criar conta";
                    mensagem.style.color = "#ff6b6b";
                }

            } catch (erro) {
                mensagem.innerHTML = "Erro no servidor";
                mensagem.style.color = "#ff6b6b";
                console.log(erro);
            }
        });
    }

    /* =========================
       DARK MODE
    ========================= */
    if (themeToggle) {
        const temaSalvo = localStorage.getItem("tema");

        if (temaSalvo === "dark") {
            document.body.classList.add("dark");
            themeToggle.innerHTML = "☀️";
        }

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");

            if (document.body.classList.contains("dark")) {
                themeToggle.innerHTML = "☀️";
                localStorage.setItem("tema", "dark");
            } else {
                themeToggle.innerHTML = "🌙";
                localStorage.setItem("tema", "light");
            }
        });
    }
});