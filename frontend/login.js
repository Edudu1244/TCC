document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const themeToggle = document.getElementById("themeToggle");
    const msg = document.getElementById("mensagem");

    if (formLogin) {
        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault(); 

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value; 

            try {
                const response = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha }) 
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem("token", data.token);
                    if (data.usuario) {
                        localStorage.setItem("usuario", JSON.stringify(data.usuario));
                    }

                    msg.style.color = "#4edf7a";
                    msg.innerText = "Login realizado com sucesso! Entrando...";

                    setTimeout(() => {
                        window.location.href = "simulacao.html";
                    }, 1200);

                } else {
                    msg.style.color = "#ff4d4d";
                    msg.innerText = data.message || "Usuário ou senha incorretos.";
                }

            } catch (error) {
                console.error("Erro na requisição de login:", error);
                msg.style.color = "#ff4d4d";
                msg.innerText = "Erro ao conectar com o servidor.";
            }
        });
    }

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