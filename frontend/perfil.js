document.getElementById("nomeUsuario").textContent =
localStorage.getItem("nome") || "Usuário SMLDP";

document.getElementById("emailUsuario").textContent =
localStorage.getItem("email") || "usuario@email.com";

function editarPerfil(){

    const novoNome = prompt(
        "Digite seu nome:",
        document.getElementById("nomeUsuario").textContent
    );

    if(novoNome){

        localStorage.setItem("nome", novoNome);

        document.getElementById("nomeUsuario").textContent =
        novoNome;
    }
}

// Checklist salvo

const checkboxes =
document.querySelectorAll(".checklist input");

checkboxes.forEach((checkbox,index)=>{

    const salvo =
    localStorage.getItem("check_"+index);

    if(salvo==="true"){
        checkbox.checked = true;
    }

    checkbox.addEventListener("change",()=>{

        localStorage.setItem(
            "check_"+index,
            checkbox.checked
        );

    });

});

// Gráfico

const ctx =
document.getElementById("graficoEconomia");

new Chart(ctx,{

    type:"line",

    data:{

        labels:[
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun"
        ],

        datasets:[{

            label:"Economia (R$)",

            data:[
                3000,
                6000,
                9000,
                13000,
                18000,
                22500
            ],

            borderWidth:4,

            tension:.4,

            fill:true

        }]
    },

    options:{

        responsive:true,

        plugins:{

            legend:{
                labels:{
                    color:"white"
                }
            }
        },

        scales:{

            x:{
                ticks:{
                    color:"white"
                }
            },

            y:{
                ticks:{
                    color:"white"
                }
            }
        }
    }
});

// Animação dos números

const numeros =
document.querySelectorAll(".stat-card h2");

numeros.forEach(numero=>{

    const texto = numero.innerText;

    if(!isNaN(parseInt(texto))){

        let atual = 0;

        const alvo = parseInt(texto);

        const intervalo = setInterval(()=>{

            atual++;

            numero.innerText = atual;

            if(atual >= alvo){

                clearInterval(intervalo);

                numero.innerText = alvo;
            }

        },40);
    }
});

 function fazerLogout(event) {
    event.preventDefault();
    
    localStorage.removeItem('token'); 
    
    window.location.href = 'inicial.html';
} 