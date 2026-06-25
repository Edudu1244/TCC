document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    // 1. TRAVA DE SEGURANÇA
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // 2. BUSCANDO DADOS REAIS DO BANCO
    try {
        const resposta = await fetch("http://localhost:3000/api/perfil", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await resposta.json();

        if (data.success) {
            const usuario = data.usuario;

            // Injeta os dados nos seletores do HTML
            // Pega só o primeiro nome para a saudação lateral
            const nomeField = document.getElementById("nomeUsuario");
            if (nomeField) nomeField.textContent = usuario.nome.split(" ")[0]; 
            
            // Preenche os cards de perfil (verifique se os IDs batem com seu HTML)
            if (document.getElementById("perfilNome")) document.getElementById("perfilNome").textContent = usuario.nome;
            if (document.getElementById("perfilIdade")) document.getElementById("perfilIdade").textContent = `${usuario.idade} anos`;
            if (document.getElementById("perfilSexo")) document.getElementById("perfilSexo").textContent = usuario.sexo;
            if (document.getElementById("perfilProfissao")) document.getElementById("perfilProfissao").textContent = usuario.profissao;
            if (document.getElementById("emailUsuario")) document.getElementById("emailUsuario").textContent = usuario.email;
        }
    } catch (erro) {
        console.error("Erro ao conectar à API de perfil:", erro);
    }

    // ==========================================
    // 3. CHECKLIST SALVO NO LOCALSTORAGE
    // ==========================================
    const checkboxes = document.querySelectorAll(".checklist input");

    checkboxes.forEach((checkbox, index) => {
        const salvo = localStorage.getItem("check_" + index);

        if (salvo === "true") {
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", () => {
            localStorage.setItem("check_" + index, checkbox.checked);
        });
    });

    // ==========================================
    // 4. GRÁFICO (CHART.JS)
    // ==========================================
    const ctx = document.getElementById("graficoEconomia");
    if (ctx) {
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                datasets: [{
                    label: "Economia (R$)",
                    data: [3000, 6000, 9000, 13000, 18000, 22500],
                    borderWidth: 4,
                    tension: .4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: "white" } }
                },
                scales: {
                    x: { ticks: { color: "white" } },
                    y: { ticks: { color: "white" } }
                }
            }
        });
    }

    // ==========================================
    // 5. ANIMAÇÃO DOS NÚMEROS
    // ==========================================
    const numeros = document.querySelectorAll(".stat-card h2");

    numeros.forEach(numero => {
        const texto = numero.innerText;

        if (!isNaN(parseInt(texto))) {
            let atual = 0;
            const alvo = parseInt(texto);
            const intervalo = setInterval(() => {
                atual++;
                numero.innerText = atual;
                if (atual >= alvo) {
                    clearInterval(intervalo);
                    numero.innerText = alvo;
                }
            }, 40);
        }
    });
});

// ==========================================
// 6. FUNÇÕES EXTERNAS (LOGOUT E EDIÇÃO)
// ==========================================
function editarPerfil() {
    const novoNome = prompt("Digite seu nome:", document.getElementById("nomeUsuario").textContent);
    if (novoNome) {
        document.getElementById("nomeUsuario").textContent = novoNome;
        // Nota para o futuro: Para salvar no banco, você precisaria fazer um fetch(PUT/POST) aqui
    }
}

function fazerLogout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'inicial.html';
}