const btnSimular = document.getElementById("btnSimular");
const btnDesconectar = document.getElementById("btnDesconectar");
const nomeUsuario = document.getElementById("nomeUsuario");
const themeToggle = document.getElementById("themeToggle");

const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "dark") {
    document.body.classList.add("dark");
}

if (btnSimular) {
  btnSimular.addEventListener("click", buscarDados);
}
const token = localStorage.getItem("token");
const user = localStorage.getItem("usuario");

if (user) {
  nomeUsuario.innerText = JSON.parse(user);
} else {
  nomeUsuario.innerText = "Visitante";
}

if (!token) {
  alert("🔒 Acesso negado! Por favor, faça login para acessar o simulador.");
  window.location.href = "login.html";
}

async function buscarDados(event) {
  // Bloqueio imediato e absoluto do recarregamento
  event.preventDefault();

  try {
    const paisSelecionado = document.getElementById("paisDestino").value;
    const msgStatus = document.getElementById("msgStatus");

    if (!paisSelecionado) {
      alert("Por favor, selecione um país válido.");
      return;
    }

    if (msgStatus) {
      msgStatus.innerText = "Processando variáveis no servidor...";
      msgStatus.style.color = "#7fb0ff";
    }

    // Envia os dados para o servidor
    const response = await fetch("http://localhost:3000/api/simular", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paisDestino: paisSelecionado }),
    });

    const data = await response.json();
    console.log("Dados recebidos do servidor:", data);

    // SEGUNDA TRAVA DE SEGURANÇA: Isola a exibição dos dados
    // Se o servidor mandar dados errados, o erro morre aqui dentro e a página NÃO recarrega
    try {
      const resCusto = document.getElementById("resCusto");
      const resSalario = document.getElementById("resSalario");
      const resQualidade = document.getElementById("resQualidade");
      const resMigracao = document.getElementById("resMigracao");
      const resScore = document.getElementById("resScore");

      // Convertemos os dados recebidos para garantir que são números válidos
      const custo = data.custoVida || 0;
      const qualidade = Number(data.qualidadeVida) || 0;
      const dificuldade = data.dificuldade || 0;
      const score = data.scoreFinal || 0;
      const resultadoTxt = data.resultado || "Sucesso";

      // Injeta os valores nas tags HTML com segurança
      if (resCusto) resCusto.innerText = `${custo} / 10`;
      if (resQualidade) resQualidade.innerText = `${qualidade} / 10`;
      if (resMigracao) resMigracao.innerText = `${dificuldade} / 10`;
      if (resScore) resScore.innerText = `${score}%`;

      // Faz o cálculo do salário tratando o valor numérico
      if (resSalario) {
        resSalario.innerText = `${Math.round(qualidade * 1.2)} / 10`;
      }

      if (msgStatus) {
        msgStatus.innerText = `Diagnóstico: ${resultadoTxt}`;
        msgStatus.style.color = "#6bff95";
      }
    } catch (erroDeRenderizacao) {
      console.error("Erro ao colocar os dados na tela:", erroDeRenderizacao);
      if (msgStatus) {
        msgStatus.innerText =
          "O servidor respondeu, mas os dados vieram em formato inválido.";
        msgStatus.style.color = "#ff6b6b";
      }
    }
  } catch (error) {
    console.error("Erro na rede ou servidor offline:", error);
    const msgStatus = document.getElementById("msgStatus");
    if (msgStatus) {
      msgStatus.innerText = "Não foi possível conectar ao servidor backend.";
      msgStatus.style.color = "#ff6b6b";
    }
  }
}

if (formSimulacao) {
  formSimulacao.addEventListener("submit", buscarDados);
}