document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const btnSimularPrincipal = document.getElementById("btnSimularPrincipal");
    const menuAuthContainer = document.getElementById("menuAuthContainer");

    const token = localStorage.getItem("token");

    /* ==========================================================
       1. CONTROLE VISUAL DA NAV (EXIBE LOGIN OU LINK DO PAINEL)
       ========================================================== */
    if (menuAuthContainer) {
        if (token) {
            menuAuthContainer.innerHTML = `
                <li style="display:flex; gap:15px; align-items:center;">
                    <a href="simulacao.html" style="font-weight:600; color:#2d7eff;">Acessar Simulador</a>
                    <a href="#" id="btnLogout" style="opacity:0.7; font-size:14px;">Sair</a>
                </li>
            `;
            
            const btnLogout = document.getElementById("btnLogout");
            if (btnLogout) {
                btnLogout.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    window.location.href = "inicial.html";
                });
            }
        }
    }

    /* ==========================================================
       2. TRAVA DO BOTÃO CENTRAL DE CAPTURA DO HERO
       ========================================================== */
    if (btnSimularPrincipal) {
        btnSimularPrincipal.addEventListener("click", () => {
            if (token) {
                window.location.href = "simulacao.html";
            } else {
                alert("Você precisa estar autenticado para realizar simulações. Faça login ou crie uma conta.");
                window.location.href = "login.html";
            }
        });
    }

    /* ==========================================================
       3. DARK MODE (SINCRONIZADO)
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