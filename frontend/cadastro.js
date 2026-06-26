document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formCadastro"); 
    const mensagem = document.getElementById("mensagem");
    const selectPais = document.getElementById("paisAtual"); // Captura o novo select de países
    const temaSalvo = localStorage.getItem("tema");
    
    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
    }

    // ==========================================================
    // FUNÇÃO PARA CARREGAR OS PAÍSES DINAMICAMENTE DO BACKEND
    // ==========================================================
    async function carregarPaisesCadastro() {
        try {
            const response = await fetch("http://localhost:3000/api/paises");
            const data = await response.json();

            if (response.ok && data.success) {
                // Limpa o select e define a opção padrão inicial
                selectPais.innerHTML = '<option value="" disabled selected>Selecione seu país</option>';
                
                // Preenche com os países vindos do banco SQLite
                data.paises.forEach(pais => {
                    const option = document.createElement("option");
                    option.value = pais.nome;
                    option.textContent = pais.nome;
                    selectPais.appendChild(option);
                });
            } else {
                selectPais.innerHTML = '<option value="">Erro ao carregar lista</option>';
            }
        } catch (error) {
            console.error("Erro ao buscar países para o cadastro:", error);
            selectPais.innerHTML = '<option value="">Servidor offline</option>';
        }
    }

    // Dispara a busca de países assim que a página abre
    carregarPaisesCadastro();

    // ==========================================================
    // ENVIO DO FORMULÁRIO E INTEGRAÇÃO BACKEND
    // ==========================================================
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const dados = {
                nome: document.getElementById("nome").value.trim(),
                idade: Number(document.getElementById("idade").value), 
                sexo: document.getElementById("sexo").value,
                profissao: document.getElementById("profissao").value.trim(),
                pais: selectPais.value, // Pega o país selecionado no select
                email: document.getElementById("email").value.trim(),
                senha: document.getElementById("senha").value.trim()
            };

            // Validações básicas de front-end
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
                // Faz o envio dos dados para a rota do Backend
                const resposta = await fetch("http://localhost:3000/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const data = await resposta.json();

                if (data.success) {
                    // 🌟 Salva o token e os dados gerados pelo controller no localStorage
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    if (data.usuario) {
                        localStorage.setItem("usuario", JSON.stringify(data.usuario));
                    }
                    
                    // Exibe a mensagem de sucesso e aguarda 1.5s antes de mudar de página
                    mensagem.innerText = "Conta criada com sucesso! Redirecionando...";
                    mensagem.style.color = "#6bff95";

                    setTimeout(() => {
                        window.location.href = "inicial.html";
                    }, 1500);

                } else {
                    // Caso o backend recuse (ex: email já existe)
                    mensagem.innerText = data.message;
                    mensagem.style.color = "#ff6b6b";
                }

            } catch (error) {
                console.error("Erro ao realizar a requisição de cadastro:", error);
                mensagem.innerText = "Erro ao conectar com o servidor.";
                mensagem.style.color = "#ff6b6b";
            }
        });
    }
});
