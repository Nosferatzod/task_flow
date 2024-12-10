const btnAdicionarTarefa = document.querySelector('.btn-add-task');
const formAdicionarTarefa = document.querySelector('.form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const botaoIniciarFoco = document.getElementById('startFocusButton');
const displayTimer = document.getElementById('focusTimer');

const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let activeTaskIndex = null;
let focusTimer;
let tempo = 60; // 1 minuto para o timer de foco

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
}

function criarElementoTarefa(tarefa, index) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    // Alternar tarefa ativa
    li.addEventListener('click', () => {
        const itensAtivos = document.querySelectorAll('.active');
        itensAtivos.forEach(item => item.classList.remove('active'));

        if (!li.classList.contains('active')) {
            li.classList.add('active');
            activeTaskIndex = index;
        } else {
            li.classList.remove('active');
            activeTaskIndex = null;
        }
    });

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('app_button-edit');
    botaoEditar.textContent = "Editar";

    botaoEditar.addEventListener('click', (evento) => {
        evento.stopPropagation(); // Impede que o clique no botão "Editar" ative a tarefa

        const novaDescricao = prompt("Edite sua tarefa:", tarefa.descricao);

        if (novaDescricao === null || novaDescricao.trim() === "") {
            console.log("Edição cancelada ou descrição inválida.");
            return;
        }

        tarefa.descricao = novaDescricao;
        paragrafo.textContent = tarefa.descricao;

        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        alert("Tarefa atualizada com sucesso!");
    });

    li.append(paragrafo);
    li.append(botaoEditar);
    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
    textarea.focus();
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const tarefa = {
        descricao: textarea.value
    };

    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa, tarefas.length - 1);
    ulTarefas.append(elementoTarefa);
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
});

tarefas.forEach((tarefa, index) => {
    const elementoTarefa = criarElementoTarefa(tarefa, index);
    ulTarefas.append(elementoTarefa);
});

botaoIniciarFoco.addEventListener('click', () => {
    if (activeTaskIndex !== null) {
        iniciarCronometro();
    } else {
        alert('Por favor, selecione uma tarefa para focar!');
    }
});

function iniciarCronometro() {
    botaoIniciarFoco.disabled = true;
    tempo = 60; // Reseta o tempo para 1 minuto
    displayTimer.textContent = formatarTempo(tempo);

    focusTimer = setInterval(() => {
        tempo--;
        displayTimer.textContent = formatarTempo(tempo);

        if (tempo <= 0) {
            clearInterval(focusTimer);
            document.dispatchEvent(new CustomEvent('FocoFinalizado'));
        }
    }, 1000);
}

document.addEventListener('FocoFinalizado', () => {
    const tarefaConcluida = document.querySelector('.active');
    if (tarefaConcluida) {
        tarefaConcluida.classList.add('task-completed');
        tarefaConcluida.classList.remove('active');
        alert('Foco finalizado! Tarefa concluída.');
    }

    botaoIniciarFoco.disabled = false;
});
