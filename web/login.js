// login.js
document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const themeToggle = document.getElementById("themeToggle");

    /* =========================
       LOGIN INTERAÇÃO BACK-END
    ========================= */
    if (formLogin) {
        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault(); 

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value; 
            const msg = document.getElementById("mensagem");       

            try {
                const response = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha }) 
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    if (data.usuario) {
                        localStorage.setItem("usuario", JSON.stringify(data.usuario));
                    }

                    msg.style.color = "green";
                    msg.innerText = "Login realizado com sucesso! Entrando...";

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1200);

                } else {
                    msg.style.color = "red";
                    msg.innerText = data.message || "Usuário ou senha incorretos.";
                }

            } catch (error) {
                console.error("Erro na requisição de login:", error);
                msg.style.color = "red";
                msg.innerText = "Erro ao conectar com o servidor.";
            }
        });
    }

    /* =========================
       DARK MODE (CORRIGIDO)
    ========================= */
    if (themeToggle) {
        // Verifica se o usuário já tinha deixado o modo escuro ativo antes
        const temaSalvo = localStorage.getItem("tema");

        if (temaSalvo === "dark") {
            document.body.classList.add("dark");
            themeToggle.textContent = "☀️";
        }

        // Escuta o clique no botão de lua/sol da tela de login
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const darkAtivo = document.body.classList.contains("dark");
            
            themeToggle.textContent = darkAtivo ? "☀️" : "🌙";
            localStorage.setItem("tema", darkAtivo ? "dark" : "light");
        });
    }
});