document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const btnSimularPrincipal = document.getElementById("btnSimularPrincipal");
    const menuAuthContainer = document.getElementById("menuAuthContainer");

    const token = localStorage.getItem("token");

    /* ==========================================================
       1. CONTROLE VISUAL DA NAV (EXIBE PERFIL E SIMULADOR SE LOGADO)
       ========================================================== */
    if (menuAuthContainer) {
        if (token) {
            menuAuthContainer.innerHTML = `
                <a href="perfil.html" class="nav-perfil-btn">Perfil</a>
            `;
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