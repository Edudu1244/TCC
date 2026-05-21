// script.js
document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       ELEMENTOS
    ========================= */
    const selectPais = document.getElementById("pais");
    const resultados = document.querySelectorAll(".result-item strong");
    const score = document.querySelector(".score-box h2");
    const themeToggle = document.getElementById("themeToggle");

    /* =========================
       DADOS DOS PAÍSES
    ========================= */
    const countriesData = {
        "Canadá": { custo: "R$ 8.450", salario: "R$ 15.200", qualidade: "Alta", migracao: "Média", score: "78%" },
        "Estados Unidos": { custo: "R$ 11.900", salario: "R$ 22.000", qualidade: "Alta", migracao: "Difícil", score: "70%" },
        "Portugal": { custo: "R$ 5.500", salario: "R$ 9.200", qualidade: "Alta", migracao: "Fácil", score: "90%" },
        "França": { custo: "R$ 9.800", salario: "R$ 14.500", qualidade: "Alta", migracao: "Média", score: "76%" },
        "Japão": { custo: "R$ 10.200", salario: "R$ 17.000", qualidade: "Alta", migracao: "Média", score: "82%" },
        "Alemanha": { custo: "R$ 9.100", salario: "R$ 16.500", qualidade: "Alta", migracao: "Média", score: "85%" },
        "Austrália": { custo: "R$ 11.000", salario: "R$ 20.000", qualidade: "Alta", migracao: "Média", score: "88%" },
        "Suíça": { custo: "R$ 18.500", salario: "R$ 32.000", qualidade: "Alta", migracao: "Difícil", score: "80%" }
    };

    /* =========================
       SIMULADOR VISUAL (DEMO)
    ========================= */
    function simularPais() {
        const paisSelecionado = selectPais.value;
        const dados = countriesData[paisSelecionado];

        if (!dados || resultados.length < 4) return;

        resultados[0].textContent = dados.custo;
        resultados[1].textContent = dados.salario;
        resultados[2].textContent = dados.qualidade;
        resultados[3].textContent = dados.migracao;
        if (score) score.textContent = dados.score;
    }

    /* =========================
       EVENTO SELECT
    ========================= */
    if (selectPais) {
        selectPais.addEventListener("change", simularPais);
        simularPais();
    }

    /* =========================
       DARK MODE
    ========================= */
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