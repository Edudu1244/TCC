document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formCadastro"); 
    const mensagem = document.getElementById("mensagem");
    const themeToggle = document.getElementById("themeToggle");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const dados = {
                nome: document.getElementById("nome").value.trim(),
                idade: Number(document.getElementById("idade").value), 
                sexo: document.getElementById("sexo").value,
                profissao: document.getElementById("profissao").value.trim(),
                pais: document.getElementById("paisAtual").value.trim(), 
                email: document.getElementById("email").value.trim(),
                senha: document.getElementById("senha").value.trim()
            };

            if (
                !dados.nome ||
                !dados.idade ||
                !dados.sexo ||
                !dados.profissao ||
                !dados.pais ||
                !dados.email ||
                !dados.senha
            ) {
                mensagem.innerText = "Preencha todos os campos obrigatórios";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            if (!dados.email.includes("@")) {
                mensagem.innerText = "Digite um email válido";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            if (dados.senha.length < 6) {
                mensagem.innerText = "A senha deve ter no mínimo 6 caracteres";
                mensagem.style.color = "#ff6b6b";
                return;
            }

            try {
                const resposta = await fetch("http://localhost:3000/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const data = await resposta.json();

                if (resposta.ok || data.success) {
                    mensagem.innerText = "Conta criada com sucesso!";
                    mensagem.style.color = "#6bff95";

                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);

                } else {
                    mensagem.innerText = data.message || "Erro ao criar conta";
                    mensagem.style.color = "#ff6b6b";
                }

            } catch (erro) {
                mensagem.innerText = "Erro ao conectar com o servidor";
                mensagem.style.color = "#ff6b6b";
                console.error("Erro no processo de cadastro:", erro);
            }
        });
    }

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