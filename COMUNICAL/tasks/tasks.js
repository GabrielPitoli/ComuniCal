document.addEventListener('DOMContentLoaded', () => {

    const modalOverlay = document.getElementById('modalOverlay');
    const addTaskFab = document.getElementById('addTaskFab');
    const modalClose = document.getElementById('modalClose');
    const btnCancel = document.getElementById('btnCancel');
    const taskForm = document.getElementById('taskForm');
    const tasksGrid = document.getElementById('tasksGrid');
    const searchInput = document.getElementById('searchInput');
    const taskCategorySelect = document.getElementById('taskCategory');
    const onlineTaskGroup = document.getElementById('onlineTaskGroup');

    const monthYearFilter = document.getElementById('monthYearFilter');
    const dayFilter = document.getElementById('dayFilter');

    const importantModalOverlay = document.getElementById('importantModalOverlay');
    const importantModalClose = document.getElementById('importantModalClose');
    const showImportantFab = document.getElementById('showImportantFab');
    const importantTasksAbertas = document.getElementById('importantTasksAbertas');
    const importantTasksConcluidas = document.getElementById('importantTasksConcluidas');

    const TASK_STORAGE_KEY = 'comunical_tasks';

    function getTasks() {
        const tasks = localStorage.getItem(TASK_STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
    }

    function saveTasks(tasks) {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    }

    function seedTasks() {
        let tasks = getTasks();
        if (tasks.length === 0) {
            const today = new Date();
            const todayISO = today.toISOString().split('T')[0];
            
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
            const nextMonthISO = nextMonth.toISOString().split('T')[0];

            tasks = [
                {
                    id: `task_${Date.now() + 1}`,
                    title: "Revisar protótipo App",
                    date: todayISO, 
                    time: "10:00",
                    location: "📍 Home Office",
                    category: "🎓 Acadêmico",
                    completed: false,
                    isImportant: true
                },
                {
                    id: `task_${Date.now() + 2}`,
                    title: "Jogo de Handebol",
                    date: todayISO, 
                    time: "19:00",
                    location: "📍 Quadra Padiall",
                    category: "⚽ Esportivo",
                    completed: false,
                    isImportant: false
                },
                {
                    id: `task_${Date.now() + 3}`,
                    title: "Entrega Sprint 5",
                    date: nextMonthISO, 
                    time: "09:00",
                    location: "📍 Jira",
                    category: "🎓 Acadêmico",
                    completed: false,
                    isImportant: false
                }
            ];
            saveTasks(tasks); 
        }
    }

    function populateDateFilters() {
        const now = new Date();
        monthYearFilter.innerHTML = ''; 

        const allMonthsOption = new Option("Mês", "todos");
        monthYearFilter.add(allMonthsOption);

        for (let i = -6; i <= 6; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const year = date.getFullYear();
            const monthIndex = date.getMonth();
            
            const monthNameShort = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''); 
            const yearShort = year.toString().slice(-2); 
            const optionText = `${monthNameShort.charAt(0).toUpperCase() + monthNameShort.slice(1)} ${yearShort}`;
            
            const optionValue = `${year}-${monthIndex}`; 

            const option = new Option(optionText, optionValue);
            monthYearFilter.add(option);
        }
        
        updateDayFilter();
    }

    function updateDayFilter() {
        const selectedMonthYear = monthYearFilter.value;
        dayFilter.innerHTML = '';

        const allDaysOption = new Option("Dia", "todos");
        dayFilter.add(allDaysOption);

        if (selectedMonthYear === 'todos') {
            return; 
        }

        const [year, month] = selectedMonthYear.split('-').map(Number);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const option = new Option(i, i);
            dayFilter.add(option);
        }
    }

    function createTaskCardHTML(task) {
        let displayTime = 'Dia Todo';
        if (task.time) {
            displayTime = task.time.substring(0, 5);
        }
        
        const isImportant = task.isImportant;

        return `
            <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-image">
                    <span class="image-icon">${displayTime}</span>
                </div>
                
                <div class="task-info">
                    <div class="task-details">
                        <p class="task-title">${task.title}</p>
                        <p class="task-category">${task.category} ${task.isOnline ? '<span class="online-badge">Online</span>' : ''}</p>
                        <p class="task-location">${task.location || '📍 Local não definido'}</p>
                    </div>
                    <div class="task-actions">
                        <button class="btn-important ${isImportant ? 'active' : ''}">🚨 Importante</button>
                        <button class="btn-share">📤</button>
                    </div>
                </div>
            </div>
        `;
    }

    function loadAndRenderTasks() {
        const tasks = getTasks();
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMonthYear = monthYearFilter.value;
        const selectedDay = dayFilter.value;
        
        tasksGrid.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                                  (task.category && task.category.toLowerCase().includes(searchTerm)) ||
                                  (task.location && task.location.toLowerCase().includes(searchTerm));
            
            if (!matchesSearch) return false;

            const taskDate = new Date(task.date + 'T00:00:00');
            
            if (selectedMonthYear === 'todos') {
                return true; 
            }
            
            const [year, month] = selectedMonthYear.split('-').map(Number);
            
            if (taskDate.getFullYear() !== year || taskDate.getMonth() !== month) {
                return false;
            }
            
            if (selectedDay === 'todos') {
                return true; 
            }

            return taskDate.getDate() === parseInt(selectedDay);
        });

        if (filteredTasks.length === 0) {
            tasksGrid.innerHTML = '<p class="empty-state">Nenhuma tarefa encontrada para esta seleção.</p>';
            return;
        }

        filteredTasks.sort((a, b) => {
             const dateA = new Date(a.date);
             const dateB = new Date(b.date);
             if (dateA < dateB) return -1;
             if (dateA > dateB) return 1;
             return (a.time || '00:00').localeCompare(b.time || '00:00');
        });

        filteredTasks.forEach(task => {
            tasksGrid.insertAdjacentHTML('beforeend', createTaskCardHTML(task));
        });
    }

    function openModal() {
        modalOverlay.classList.add('active');
        
        try {
            const selectedMonthYear = monthYearFilter.value;
            const selectedDay = dayFilter.value;
            let dateToSet = new Date();

            if (selectedMonthYear !== 'todos') {
                const [year, month] = selectedMonthYear.split('-').map(Number);
                const day = (selectedDay !== 'todos') ? parseInt(selectedDay) : dateToSet.getDate();
                
                if(year === dateToSet.getFullYear() && month === dateToSet.getMonth()){
                     dateToSet.setDate(day);
                } else {
                     dateToSet = new Date(year, month, (selectedDay !== 'todos') ? day : 1);
                }
            }
            document.getElementById('taskDate').value = dateToSet.toISOString().split('T')[0];
        } catch (e) {
            document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        taskForm.reset();
        onlineTaskGroup.style.display = 'none';
    }
    
    function handleAddTask(e) {
        e.preventDefault(); 
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
        const location = document.getElementById('taskLocation').value;
        const categorySelect = document.getElementById('taskCategory');
        const category = categorySelect.options[categorySelect.selectedIndex].text;
        const isOnline = document.getElementById('taskIsOnline').checked;

        const newTask = {
            id: `task_${Date.now()}`, title, description, date, time,
            location: `📍 ${location}`, category, completed: false, isImportant: false,
            isOnline: isOnline
        };

        let tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        loadAndRenderTasks(); 
        closeModal();
    }
    
    function toggleTaskCompletion(card) {
        if (!card) return;
        const taskId = card.dataset.id;
        let tasks = getTasks();
        
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        saveTasks(tasks);
        loadAndRenderTasks(); 
    }

    function handleShareTask(button) {
        const card = button.closest('.task-card');
        const title = card.querySelector('.task-title').textContent;
        const location = card.querySelector('.task-location').textContent;
        const shareText = `Tarefa: ${title}\nLocal: ${location.trim()}`;

        if (navigator.share) {
            navigator.share({
                title: `Tarefa: ${title}`,
                text: shareText,
                url: window.location.href
            }).catch(err => console.error("Erro ao compartilhar", err));
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert("Dados da tarefa copiados!");
            });
        }
    }

    function handleToggleImportant(button) {
        const card = button.closest('.task-card');
        const taskId = card.dataset.id;
        let tasks = getTasks();

        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.isImportant = !task.isImportant;
            }
            return task;
        });

        saveTasks(tasks);
        loadAndRenderTasks(); 
    }

    function handleGridClick(e) {
        const shareBtn = e.target.closest('.btn-share');
        if (shareBtn) {
            handleShareTask(shareBtn);
            return;
        }

        const importantBtn = e.target.closest('.btn-important');
        if (importantBtn) {
            handleToggleImportant(importantBtn);
            return;
        }

        const card = e.target.closest('.task-card');
        if (card) {
            toggleTaskCompletion(card);
        }
    }
    
    function openImportantModal() {
        const allTasks = getTasks();
        const importantTasks = allTasks.filter(task => task.isImportant);
        
        const tasksAbertas = importantTasks.filter(task => !task.completed);
        const tasksConcluidas = importantTasks.filter(task => task.completed);
        
        importantTasksAbertas.innerHTML = '';
        if (tasksAbertas.length > 0) {
            tasksAbertas.forEach(task => {
                importantTasksAbertas.insertAdjacentHTML('beforeend', createTaskCardHTML(task));
            });
        } else {
            importantTasksAbertas.innerHTML = '<p class="empty-state">Nenhuma tarefa importante a fazer.</p>';
        }
        
        importantTasksConcluidas.innerHTML = '';
        if (tasksConcluidas.length > 0) {
            tasksConcluidas.forEach(task => {
                importantTasksConcluidas.insertAdjacentHTML('beforeend', createTaskCardHTML(task));
            });
        } else {
            importantTasksConcluidas.innerHTML = '<p class="empty-state">Nenhuma tarefa importante concluída.</p>';
        }

        importantModalOverlay.classList.add('active');
    }

    function closeImportantModal() {
        importantModalOverlay.classList.remove('active');
    }

    addTaskFab.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    tasksGrid.addEventListener('click', handleGridClick);
    searchInput.addEventListener('input', loadAndRenderTasks);

    monthYearFilter.addEventListener('change', () => {
        updateDayFilter(); 
        loadAndRenderTasks(); 
    });

    dayFilter.addEventListener('change', loadAndRenderTasks);

    taskCategorySelect.addEventListener('change', () => {
        if (taskCategorySelect.value === 'academico') {
                onlineTaskGroup.style.display = 'block';
            } else {
                onlineTaskGroup.style.display = 'none';
                document.getElementById('taskIsOnline').checked = false;
            }
    });    

    showImportantFab.addEventListener('click', openImportantModal);
    importantModalClose.addEventListener('click', closeImportantModal);
    importantModalOverlay.addEventListener('click', (e) => {
        if (e.target === importantModalOverlay) {
            closeImportantModal();
        }
    });

    seedTasks();
    populateDateFilters();
    loadAndRenderTasks();
});