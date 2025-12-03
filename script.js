const urlFirebase = "COLE_AQUI_A_URL_DO_SEU_WEBAPP"; // substitua pela sua URL

async function buscarDados() {
    try {
        const response = await fetch(urlFirebase);
        const dados = await response.json();

        const temp = dados.temperatura ?? 0;
        const umidade = dados.umidade ?? 0;
        const pressao = dados.pressao ?? 0;

        document.getElementById("temp").innerText = temp + " °C";
        document.getElementById("umidade").innerText = umidade + " %";
        document.getElementById("pressao").innerText = pressao + " hPa";

        atualizarGraficos(temp, umidade, pressao);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Configuração dos gráficos
const configGrafico = (label, cor, maxY = null) => ({
    type: 'line',
    data: { labels: [], datasets: [{
        label,
        data: [],
        borderColor: cor,
        backgroundColor: cor + '55',
        fill: true,
        tension: 0.4,
        pointRadius: 4
    }]},
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            y: { beginAtZero: false, max: maxY },
            x: { ticks: { color: '#ffffff' } }
        }
    }
});

const graficoTemperatura = new Chart(document.getElementById('graficoTemp'), configGrafico('Temperatura', '#ffaaaa'));
const graficoUmidade = new Chart(document.getElementById('graficoUmidade'), configGrafico('Umidade', '#aaddff', 100));
const graficoPressao = new Chart(document.getElementById('graficoPressao'), configGrafico('Pressão', '#aaffaa'));

// Atualiza gráficos com histórico de 30 pontos
function atualizarGraficos(temp, umidade, pressao) {
    const agora = new Date().toLocaleTimeString();

    function adicionar(chart, valor) {
        chart.data.labels.push(agora);
        chart.data.datasets[0].data.push(valor);
        if(chart.data.labels.length > 30) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }

    adicionar(graficoTemperatura, temp);
    adicionar(graficoUmidade, umidade);
    adicionar(graficoPressao, pressao);
}

// Atualiza a cada 5 segundos
setInterval(buscarDados, 5000);
