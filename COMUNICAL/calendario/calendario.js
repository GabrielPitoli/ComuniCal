class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentDate.setFullYear(2025);
        this.selectedDate = null;
        this.today = new Date();
        this.taskManager = null;
        
        this.monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        this.dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        this.init();
    }

    setTaskManager(manager) {
        this.taskManager = manager;
        this.taskManager.seedAndRenderTasks();
        this.taskManager.seedAndRenderEvents();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateSelectors(); 
    }
    
    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.previousMonth();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.nextMonth();
        });
        
        document.getElementById('monthSelect').addEventListener('change', (e) => {
            this.currentDate.setMonth(parseInt(e.target.value));
            this.render(); 
        });
        
        document.getElementById('yearSelect').addEventListener('change', (e) => {
            this.currentDate.setFullYear(parseInt(e.target.value));
            this.render();
        });
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
        this.updateSelectors();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
        this.updateSelectors();
    }
    
    updateSelectors() {
        document.getElementById('monthSelect').value = this.currentDate.getMonth();
        document.getElementById('yearSelect').value = this.currentDate.getFullYear();
    }
    
    render() {
        this.renderHeader();
        this.renderDays();

        if (this.taskManager) {
            this.taskManager.renderTasks(this.taskManager.getTasks());
            this.taskManager.renderEvents(this.taskManager.getEvents());
        }
    }
    
    renderHeader() {
        const monthYear = document.getElementById('monthYear');
        monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }
    
    renderDays() {
        const daysContainer = document.getElementById('calendarDays');
        daysContainer.innerHTML = '';
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date, month);
            daysContainer.appendChild(dayElement);
        }
    }
    
    createDayElement(date, currentMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = date.getDate();
        
        if (date.getMonth() === currentMonth) {
            dayElement.classList.add('current-month');
        } else {
            dayElement.classList.add('other-month');
        }
        
        if (date.getDay() === 0 || date.getDay() === 6) {
            dayElement.classList.add('weekend');
        }
        
        if (this.isSameDay(date, this.today)) {
            dayElement.classList.add('today');
        }
        
        if (this.selectedDate && this.isSameDay(date, this.selectedDate)) {
            dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', () => {
            this.selectDate(date);
        });
        
        return dayElement;
    }
    
    selectDate(date) {
        this.selectedDate = new Date(date);
        this.render();
        this.updateSelectedDateInfo(date);
    }
    
    updateSelectedDateInfo(date) {
        const infoContainer = document.getElementById('selectedDateInfo');
        const dayName = this.dayNames[date.getDay()];
        const monthName = this.monthNames[date.getMonth()];
        
        const dayOfYear = this.getDayOfYear(date);
        const weekNumber = this.getWeekNumber(date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        infoContainer.innerHTML = `
            <h3>📅 ${dayName}, ${date.getDate()} de ${monthName} de ${date.getFullYear()}</h3>
            <div style="margin-top: 15px;">
                <p><strong>Dia do ano:</strong> ${dayOfYear}º dia de ${date.getFullYear()}</p>
                <p><strong>Semana:</strong> ${weekNumber}ª semana do ano</p>
                <p><strong>Tipo:</strong> ${isWeekend ? 'Fim de semana' : 'Dia útil'}</p>
                ${this.isSameDay(date, this.today) ? '<p><strong>🎯 Hoje!</strong></p>' : ''}
            </div>
        `;
    }
    
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
}

class CalendarFeatures {
    constructor(calendar) {
        this.calendar = calendar;
        this.init();
    }
    
    init() {
        this.addKeyboardNavigation();
        this.addTouchSupport();
        this.addAnimations();
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.calendar.previousMonth();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.calendar.nextMonth();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.calendar.currentDate = new Date();
                    this.calendar.render();
                    this.calendar.updateSelectors();
                    break;
            }
        });
    }
    
    addTouchSupport() {
        let startX = 0;
        const calendarContainer = document.querySelector('.calendar-container');
        
        calendarContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        calendarContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { 
                if (diff > 0) {
                    this.calendar.nextMonth();
                } else {
                    this.calendar.previousMonth();
                }
            }
        });
    }
    
    addAnimations() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const newNodes = Array.from(mutation.addedNodes);
                    newNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('day')) {
                            node.style.opacity = '0';
                            node.style.transform = 'scale(0.8)';
                            
                            setTimeout(() => {
                                node.style.transition = 'all 0.3s ease';
                                node.style.opacity = '1';
                                node.style.transform = 'scale(1)';
                            }, Math.random() * 100);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.getElementById('calendarDays'), {
            childList: true
        });
    }
}


class TaskManager {
    constructor(calendar) {
        this.calendar = calendar;
        
        this.TASK_STORAGE_KEY = 'comunical_tasks'; 
        this.EVENT_STORAGE_KEY = 'comunical_events';

        this.tasksListContainer = document.getElementById('tasksList');
        this.eventsListContainer = document.getElementById('eventsList');
        
        this.init();
    }

    init() {
        this.bindTaskEvents();
        this.bindEventEvents();
    }

    
    getTasks() {
        const tasks = localStorage.getItem(this.TASK_STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
    }
    
    saveTasks(tasks) {
        localStorage.setItem(this.TASK_STORAGE_KEY, JSON.stringify(tasks));
    }
    
    seedAndRenderTasks() {
        let tasks = this.getTasks();
        if (tasks.length === 0) {
            tasks = [
                { id: `task_${Date.now() + 1}`, title: "Apresentação parcial do projeto", date: "2025-10-27", time: "15:00", location: "📍 Sala A03 - CT", category: "🎓 Acadêmico", completed: false },
                { id: `task_${Date.now() + 2}`, title: "Jogo de Handebol com a comunica", date: "2025-10-27", time: "19:00", location: "📍 Quadra Padiall", category: "⚽ Esportivo", completed: false }
            ];
            this.saveTasks(tasks); 
        }
        this.renderTasks(tasks);
    }
    
    renderTasks(tasks) {
        this.tasksListContainer.innerHTML = '';

        const tasksToShow = tasks; 

        if (tasksToShow.length === 0) {
            this.tasksListContainer.innerHTML = '<p style="padding: 10px; text-align: center; color: #718096;">Nenhuma tarefa. Adicione na tela de tarefas!</p>';
            return;
        }

        tasksToShow.forEach(task => {
            const taskHTML = `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <input type="checkbox" id="${task.id}" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <label for="${task.id}">${task.title}</label>
                    <button class="delete-task">×</button>
                </div>
            `;
            this.tasksListContainer.insertAdjacentHTML('beforeend', taskHTML);
        });
    }

    bindTaskEvents() {
        const taskInputArea = document.getElementById('taskInputArea');
        const saveTaskBtn = document.getElementById('saveTaskBtn');
        const cancelTaskBtn = document.getElementById('cancelTaskBtn');
        const taskInput = document.getElementById('taskInput');
        
        this.tasksListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-task')) {
                this.deleteTask(e.target.closest('.task-item'));
            }
        });
        
        this.tasksListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                this.toggleTask(e.target.closest('.task-item'));
            }
        });
        
        if (saveTaskBtn) saveTaskBtn.addEventListener('click', () => this.addTask());
        if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', () => this.cancelTaskInput());
        if (taskInput) {
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTask();
                else if (e.key === 'Escape') this.cancelTaskInput();
            });
        }
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: 'task_' + Date.now(), title: taskText,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                location: "📍 Local não definido", category: "📋 Tarefa Rápida", completed: false
            };
            const tasks = this.getTasks();
            tasks.push(newTask);
            this.saveTasks(tasks);
            this.renderTasks(tasks); 
            this.cancelTaskInput();
        }
    }
    
    cancelTaskInput() {
        const taskInputArea = document.getElementById('taskInputArea');
        if (taskInputArea) {
            taskInputArea.style.display = 'none';
            document.getElementById('taskInput').value = '';
        }
    }
    
    deleteTask(taskItem) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            const taskId = taskItem.dataset.id;
            const tasks = this.getTasks().filter(task => task.id !== taskId);
            this.saveTasks(tasks);
            this.renderTasks(tasks);
        }
    }
    
    toggleTask(taskItem) {
        const taskId = taskItem.dataset.id;
        const tasks = this.getTasks().map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        this.saveTasks(tasks);
        this.renderTasks(tasks);
    }

    
    getEvents() {
        const events = localStorage.getItem(this.EVENT_STORAGE_KEY);
        return events ? JSON.parse(events) : [];
    }
    
    saveEvents(events) {
        localStorage.setItem(this.EVENT_STORAGE_KEY, JSON.stringify(events));
    }
    
    seedAndRenderEvents() {
        let events = this.getEvents();
        if (events.length === 0) {
            events = [
                { id: `evt_${Date.now() + 1}`, title: "Festival de Teatro", date: "2025-11-15", time: "19:00", category: "cultural" },
                { id: `evt_${Date.now() + 2}`, title: "Campeonato de Futebol", date: "2025-11-22", time: "15:00", category: "esportivo" },
                { id: `evt_${Date.now() + 3}`, title: "Seminário de Tecnologia", date: "2025-11-28", time: "09:00", category: "academico" },
                { id: `evt_${Date.now() + 4}`, title: "Festa de Confraternização", date: "2025-12-05", time: "20:00", category: "social" },
                { id: `evt_${Date.now() + 5}`, title: "Concerto de Natal", date: "2025-12-12", time: "18:00", category: "cultural" },
                { id: `evt_${Date.now() + 6}`, title: "Workshop de Design", date: "2025-12-18", time: "14:00", category: "academico" }
            ];
            this.saveEvents(events); 
        }
        this.renderEvents(events);
    }


    renderEvents(events) {
        this.eventsListContainer.innerHTML = '';

        const currentCalMonth = this.calendar.currentDate.getMonth();
        const currentCalYear = this.calendar.currentDate.getFullYear();

        const eventsToShow = events.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            return eventDate.getMonth() === currentCalMonth &&
                   eventDate.getFullYear() === currentCalYear;
        });

        if (eventsToShow.length === 0) {
            this.eventsListContainer.innerHTML = '<p style="padding: 10px; text-align: center; color: #718096;">Nenhum evento para este mês.</p>';
            return;
        }

        eventsToShow.sort((a, b) => new Date(a.date) - new Date(b.date));

        eventsToShow.forEach(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
            
            const eventHTML = `
                <div class="event-item" data-id="${event.id}">
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <p>${event.time}</p>
                    </div>
                    <button class="delete-event">×</button>
                </div>
            `;
            this.eventsListContainer.insertAdjacentHTML('beforeend', eventHTML);
        });
    }

    bindEventEvents() {
        this.eventsListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-event')) {
                this.deleteEvent(e.target.closest('.event-item'));
            }
        });
        
        const saveEventBtn = document.getElementById('saveEventBtn');
        const cancelEventBtn = document.getElementById('cancelEventBtn');

        if (saveEventBtn) {
            saveEventBtn.addEventListener('click', () => this.addEvent());
        }
        if (cancelEventBtn) {
            cancelEventBtn.addEventListener('click', () => this.cancelEventInput());
        }
    }

    addEvent() {
        const eventTitle = document.getElementById('eventTitle').value.trim();
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        
        if (eventTitle && eventDate) {
            const newEvent = {
                id: 'evt_' + Date.now(),
                title: eventTitle,
                date: eventDate,
                time: eventTime || 'Dia todo',
                category: 'social',
                interested: false
            };
            
            const events = this.getEvents();
            events.push(newEvent);
            this.saveEvents(events);
            this.renderEvents(this.getEvents());
            
            this.cancelEventInput();
        }
    }

    cancelEventInput() {
        const eventInputArea = document.getElementById('eventInputArea');
        if (eventInputArea) { 
            eventInputArea.style.display = 'none';
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventDate').value = '';
            document.getElementById('eventTime').value = '';
        }
    }
    
    deleteEvent(eventItem) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            const eventId = eventItem.dataset.id;
            const events = this.getEvents().filter(event => event.id !== eventId);
            this.saveEvents(events);
            this.renderEvents(this.getEvents());
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
    const features = new CalendarFeatures(calendar);
    const taskManager = new TaskManager(calendar); 
    calendar.setTaskManager(taskManager); 
});

window.Calendar = Calendar;