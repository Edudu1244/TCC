const paises = {

};

function comparar() {

    const pais1 = paises[
        document.getElementById("pais1").value
    ];

    const pais2 = paises[
        document.getElementById("pais2").value
    ];

    document.getElementById("nomePais1").textContent =
        pais1.nome;

    document.getElementById("nomePais2").textContent =
        pais2.nome;

    document.getElementById("resultado").innerHTML = `

        <tr>
            <td>💰 Economia</td>
            <td>${pais1.economia}</td>
            <td>${pais2.economia}</td>
        </tr>

        <tr>
            <td>👥 População</td>
            <td>${pais1.populacao}</td>
            <td>${pais2.populacao}</td>
        </tr>

        <tr>
            <td>🏥 Saúde</td>
            <td>${pais1.saude}</td>
            <td>${pais2.saude}</td>
        </tr>

        <tr>
            <td>🎓 Educação</td>
            <td>${pais1.educacao}</td>
            <td>${pais2.educacao}</td>
        </tr>

        <tr>
            <td>🛡️ Defesa</td>
            <td>${pais1.defesa}</td>
            <td>${pais2.defesa}</td>
        </tr>

        <tr>
            <td>😊 Felicidade</td>
            <td>${pais1.felicidade}</td>
            <td>${pais2.felicidade}</td>
        </tr>

        <tr>
            <td>🌍 IDH</td>
            <td>${pais1.idh}</td>
            <td>${pais2.idh}</td>
        </tr>

        <tr>
            <td>📈 Crescimento Econômico</td>
            <td>${pais1.crescimento}</td>
            <td>${pais2.crescimento}</td>
        </tr>

    `;
}