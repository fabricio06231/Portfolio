// Configuração exata das matérias e suas semanas
const subjects = [
    { id: 'versionamento', name: 'Versionamento', startWeek: 21, endWeek: 26 },
    { id: 'ia', name: 'Inteligência Artificial', startWeek: 21, endWeek: 26 },
    { id: 'backend', name: 'Back-end', startWeek: 22, endWeek: 28 },
    { id: 'frontend', name: 'Front-end', startWeek: 22, endWeek: 28 },
    { id: 'banco_dados', name: 'Modelagem de Banco de Dados', startWeek: 22, endWeek: 28 },
    { id: 'mobile', name: 'Desenvolvimento Mobile', startWeek: 22, endWeek: 28 }
];

// Atividades pré-cadastradas no código (você pode adicionar mais aqui se quiser fixar no código)
const defaultActivities = {
    'versionamento_21': [
        {
            title: 'Introdução ao Git e GitHub',
            desc: 'Criação de repositório, primeiros commits e configuração de branches.',
            link: 'https://github.com'
        }
    ]
};

// Carrega atividades salvas no navegador ou usa as padrão
let portfolioData = JSON.parse(localStorage.getItem('fabricio_portfolio')) || defaultActivities;

let currentSubject = null;
let currentWeek = null;

// Alternar entre as telas (Início, Projetos, Sobre e Contato)
function showScreen(screenId, btnElement) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(screenId).classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

function goToProjects() {
    const projectNavButton = document.querySelectorAll('.nav-btn')[1];
    showScreen('projects', projectNavButton);
}

// Exibir os cards das matérias
function renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    grid.innerHTML = '';

    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.onclick = () => selectSubject(subject);
        card.innerHTML = `
            <h3>${subject.name}</h3>
            <p>Semanas ${subject.startWeek} a ${subject.endWeek}</p>
        `;
        grid.appendChild(card);
    });
}

// Abrir uma matéria e mostrar suas semanas
function selectSubject(subject) {
    currentSubject = subject;
    currentWeek = null;

    document.getElementById('weeksContainer').style.display = 'block';
    document.getElementById('activitiesPanel').style.display = 'none';
    document.getElementById('selectedSubjectTitle').innerText = subject.name;
    document.getElementById('selectedSubjectRange').innerText = `Semanas ${subject.startWeek} a ${subject.endWeek} — Selecione uma semana abaixo`;

    renderWeeks();
    document.getElementById('weeksContainer').scrollIntoView({ behavior: 'smooth' });
}

function closeSubject() {
    document.getElementById('weeksContainer').style.display = 'none';
    currentSubject = null;
    currentWeek = null;
}

// Criar os botões das semanas de acordo com o intervalo da matéria
function renderWeeks() {
    const weeksGrid = document.getElementById('weeksGrid');
    weeksGrid.innerHTML = '';

    for (let week = currentSubject.startWeek; week <= currentSubject.endWeek; week++) {
        const key = `${currentSubject.id}_${week}`;
        const count = portfolioData[key] ? portfolioData[key].length : 0;

        const btn = document.createElement('button');
        btn.className = `week-btn ${currentWeek === week ? 'selected' : ''}`;
        btn.onclick = () => selectWeek(week);
        btn.innerHTML = `
            Semana ${week}
            <span class="badge">${count} ${count === 1 ? 'atividade' : 'atividades'}</span>
        `;
        weeksGrid.appendChild(btn);
    }
}

// Abrir uma semana específica para ver/adicionar atividades
function selectWeek(weekNumber) {
    currentWeek = weekNumber;
    renderWeeks();

    const panel = document.getElementById('activitiesPanel');
    panel.style.display = 'block';
    document.getElementById('selectedWeekTitle').innerText = `${currentSubject.name} — Semana ${weekNumber}`;

    renderActivities();
}

// Salvar nova atividade na semana
function addActivity(event) {
    event.preventDefault();
    if (!currentSubject || !currentWeek) return;

    const title = document.getElementById('actTitle').value;
    const desc = document.getElementById('actDesc').value;
    let link = document.getElementById('actLink').value.trim();

    // Garante que o link funcione caso a pessoa não digite http:// ou https:// e não seja caminho local
    if (!link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('./') && !link.startsWith('/')) {
        link = 'https://' + link;
    }

    const key = `${currentSubject.id}_${currentWeek}`;
    if (!portfolioData[key]) {
        portfolioData[key] = [];
    }

    portfolioData[key].push({ title, desc, link });
    localStorage.setItem('fabricio_portfolio', JSON.stringify(portfolioData));

    document.getElementById('actTitle').value = '';
    document.getElementById('actDesc').value = '';
    document.getElementById('actLink').value = '';

    renderWeeks();
    renderActivities();
}

// Remover atividade
function deleteActivity(index) {
    const key = `${currentSubject.id}_${currentWeek}`;
    portfolioData[key].splice(index, 1);
    localStorage.setItem('fabricio_portfolio', JSON.stringify(portfolioData));

    renderWeeks();
    renderActivities();
}

// Listar atividades da semana
function renderActivities() {
    const list = document.getElementById('activityList');
    list.innerHTML = '';

    const key = `${currentSubject.id}_${currentWeek}`;
    const activities = portfolioData[key] || [];

    if (activities.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted);">Nenhuma atividade cadastrada nesta semana ainda.</p>';
        return;
    }

    activities.forEach((act, index) => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-info">
                <h5>${act.title}</h5>
                <p>${act.desc}</p>
            </div>
            <div class="activity-actions">
                <a href="${act.link}" target="_blank" class="btn-access">Acessar Atividade</a>
                <button class="btn-delete" onclick="deleteActivity(${index})">Excluir</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Iniciar o site
renderSubjects();
