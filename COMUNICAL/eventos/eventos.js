document.addEventListener('DOMContentLoaded', () => {

    const modalOverlay = document.getElementById('modalOverlay');
    const addEventFab = document.getElementById('addEventFab');
    const modalClose = document.getElementById('modalClose');
    const btnCancel = document.getElementById('btnCancel');
    const eventForm = document.getElementById('eventForm');
    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const eventCategorySelect = document.getElementById('eventCategory');
    const onlineEventGroup = document.getElementById('onlineEventGroup');

    const importantModalOverlay = document.getElementById('importantModalOverlay');
    const importantModalClose = document.getElementById('importantModalClose');
    const showImportantFab = document.getElementById('showImportantFab');
    const importantEventsList = document.getElementById('importantEventsList'); 

    const EVENT_STORAGE_KEY = 'comunical_events';

    let currentFilter = 'todos';
    let searchTerm = '';

    function getEvents() {
        const events = localStorage.getItem(EVENT_STORAGE_KEY);
        return events ? JSON.parse(events) : [];
    }

    function saveEvents(events) {
        localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
    }

    function seedEvents() {
        let events = getEvents();
        if (events.length === 0) {
            events = [
                { 
                    id: `evt_${Date.now() + 1}`, 
                    title: "Festival de Teatro", 
                    description: "Apresentações teatrais com grupos locais e nacionais", 
                    date: "2025-11-15", 
                    time: "19:00", 
                    location: "Teatro Municipal", 
                    category: "cultural", 
                    isImportant: true,
                    image: null
                },
                { 
                    id: `evt_${Date.now() + 2}`, 
                    title: "Campeonato de Futebol", 
                    description: "Final do campeonato universitário de futebol", 
                    date: "2025-11-22", 
                    time: "15:00", 
                    location: "Estádio Central", 
                    category: "esportivo", 
                    isImportant: false,
                    image: null
                },
                { 
                    id: `evt_${Date.now() + 3}`, 
                    title: "Seminário de Tecnologia", 
                    description: "Palestras sobre inovação e desenvolvimento tecnológico", 
                    date: "2025-11-28", 
                    time: "09:00", 
                    location: "Auditório Principal", 
                    category: "academico", 
                    isImportant: true,
                    image: null 
                },
                { 
                    id: `evt_${Date.now() + 6}`, 
                    title: "Palestra sobre Carreira", 
                    description: "Palestra com executivos sobre o mercado de T.I.", 
                    date: "2025-11-29", 
                    time: "19:00", 
                    location: "Auditório Principal", 
                    category: "profissional", 
                    isImportant: true,
                    image: null 
                },
                { 
                    id: `evt_${Date.now() + 7}`, 
                    title: "Grupo de Corrida", 
                    description: "Encontro do grupo de corrida da faculdade.", 
                    date: "2025-11-30", 
                    time: "07:00", 
                    location: "Parque Central", 
                    category: "saude", 
                    isImportant: false,
                    image: null 
                },
                { 
                    id: `evt_${Date.now() + 4}`, 
                    title: "Festa de Confraternização", 
                    description: "Celebração de fim de ano com toda a comunidade", 
                    date: "2025-12-05", 
                    time: "20:00", 
                    location: "Salão de Eventos", 
                    category: "social", 
                    isImportant: false,
                    image: null 
                },
                 { 
                    id: `evt_${Date.now() + 5}`, 
                    title: "Evento Passado (Teste)", 
                    description: "Este evento já ocorreu.", 
                    date: "2025-01-10",
                    time: "18:00", 
                    location: "Igreja Central", 
                    category: "cultural", 
                    isImportant: true,
                    image: null
                }
            ];
            saveEvents(events);
        }
    }

    function createEventCardHTML(event) {
        const eventDate = new Date(event.date + 'T00:00:00');
        const day = eventDate.getDate();
        const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        
        const categoryIcons = {
            cultural: '🎭',
            esportivo: '⚽',
            academico: '🎓',
            social: '🎉',
            profissional: '💼',
            saude: '🩺'
        };
        const icon = categoryIcons[event.category] || '📅';
        
        const isImportant = event.isImportant;

        let imageContent = '';
        let categoryBadge = ''; 

        if (event.image) {
            imageContent = `<img src="${event.image}" alt="${event.title}" class="event-preview-img">`;
            categoryBadge = `<span class="event-category-badge">${icon}</span>`;
        } else {
            imageContent = `<div class="image-placeholder"><span class="image-icon">${icon}</span></div>`;
        }

        return `
            <div class="event-card" data-category="${event.category}" data-id="${event.id}">
                <div class="event-image">
                    ${imageContent}
                    <div class="event-date-badge">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                </div>
                <div class="event-info">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-details">
                        <p class="event-category-text">${icon} ${event.category} ${event.isOnline ? '<span class="online-badge">Online</span>' : ''}</p>
                        <p class="event-datetime">📅 ${eventDate.toLocaleDateString('pt-BR')} • ${event.time}</p>
                        <p class="event-location">📍 ${event.location}</p>
                    </div>
                    <div class="event-actions">
                        <button class="btn-important ${isImportant ? 'active' : ''}">🚨 Importante</button>
                        <button class="btn-share">📤</button>
                    </div>
                </div>
            </div>
        `;
    }

    function loadAndRenderEvents() {
        const allEvents = getEvents();
        
        const filteredEvents = allEvents.filter(event => {
            const matchesCategory = currentFilter === 'todos' || event.category === currentFilter;
            const matchesSearch = searchTerm === '' || 
                                  event.title.toLowerCase().includes(searchTerm) || 
                                  (event.description && event.description.toLowerCase().includes(searchTerm)) ||
                                  event.location.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        eventsGrid.innerHTML = '';

        if (filteredEvents.length === 0) {
            toggleEmptyState(true);
            return;
        }
        
        toggleEmptyState(false);

        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        const eventsByMonth = filteredEvents.reduce((acc, event) => {
            const eventDate = new Date(event.date + 'T00:00:00');
            const monthYear = eventDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(event);
            return acc;
        }, {}); 

        for (const monthYear in eventsByMonth) {
            const monthHeader = document.createElement('h2');
            monthHeader.className = 'month-header';
            monthHeader.textContent = `-- ${monthYear} --`;
            eventsGrid.appendChild(monthHeader);

            eventsByMonth[monthYear].forEach(event => {
                eventsGrid.insertAdjacentHTML('beforeend', createEventCardHTML(event));
            });
        }
    }

    function toggleEmptyState(show) {
        let emptyState = document.querySelector('.empty-state');
        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <h3>Nenhum evento encontrado</h3>
                <p>Tente ajustar os filtros ou buscar por outros termos.</p>
            `;
            eventsGrid.appendChild(emptyState);
        } else if (!show && emptyState) {
            emptyState.remove();
        }
    }


    function openModal() {
        modalOverlay.classList.add('active');
        setTimeout(() => document.getElementById('eventTitle').focus(), 300);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        if (eventForm) eventForm.reset();
        if (onlineEventGroup) onlineEventGroup.style.display = 'none';

        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = 'none';
            if(document.getElementById('imagePreview')) document.getElementById('imagePreview').src = '';
        }
    }

    function handleFilterClick(e) {
        const tab = e.target.closest('.category-tab');
        if (!tab) return;

        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.category;
        
        loadAndRenderEvents();
    }

    let searchTimeout;
    function handleSearchInput(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = e.target.value.toLowerCase();
            loadAndRenderEvents();
        }, 300);
    }

    function handleToggleImportant(button) {
        const card = button.closest('.event-card');
        const eventId = card.dataset.id;
        
        const events = getEvents();
        const eventIndex = events.findIndex(evt => evt.id === eventId);
        
        if (eventIndex > -1) {
            events[eventIndex].isImportant = !events[eventIndex].isImportant;
            saveEvents(events);
            
            if (events[eventIndex].isImportant) {
                button.classList.add('active');
                showToast('Adicionado aos seus interesses!');
            } else {
                button.classList.remove('active');
                showToast('Removido dos seus interesses');
            }
        }
        if (navigator.vibrate) navigator.vibrate(50);
    }

    function shareEvent(button) {
        const card = button.closest('.event-card');
        const eventTitle = card.querySelector('.event-title').textContent;
        const shareText = `Confira este evento: ${eventTitle} via COMUNICAL`;
        
        if (navigator.share) {
            navigator.share({ title: eventTitle, text: shareText, url: window.location.href });
        } else {
            navigator.clipboard.writeText(shareText).then(() => showToast('Informações copiadas!'));
        }
    }
    
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: #2d3748; color: white; padding: 12px 20px; border-radius: 25px;
            font-size: 14px; font-weight: 500; z-index: 3000; opacity: 0;
            transition: all 0.3s ease; max-width: 80%; text-align: center;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => { if (toast.parentNode) toast.remove() }, 300);
        }, 3000);
    }

    if (eventCategorySelect) {
        eventCategorySelect.addEventListener('change', () => {
            if (eventCategorySelect.value === 'academico') {
                onlineEventGroup.style.display = 'block';
            } else {
                onlineEventGroup.style.display = 'none';
                document.getElementById('eventIsOnline').checked = false; // Limpa a caixa
            }
        });
    }

    if(addEventFab) addEventFab.addEventListener('click', openModal);
    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(btnCancel) btnCancel.addEventListener('click', closeModal);
    if(modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    document.querySelector('.category-tabs').addEventListener('click', handleFilterClick);
    searchInput.addEventListener('input', handleSearchInput);

    var detailsModalOverlay = document.getElementById('detailsModalOverlay');
    var detailsBack = document.getElementById('detailsBack');
    var detailsClose = document.getElementById('detailsClose');
    var detailsShare = document.getElementById('detailsShare');
    var detailsReminder = document.getElementById('detailsReminder');
    var detailsDelete = document.getElementById('detailsDelete');

    var currentEventId = null;

    eventsGrid.addEventListener('click', function(e) {
        if (e.target.closest('.btn-important') || e.target.closest('.btn-share')) {
            if (e.target.classList.contains('btn-important')) {
                handleToggleImportant(e.target);
            }
            if (e.target.classList.contains('btn-share')) {
                shareEvent(e.target);
            }
            return;
        }
        
        var eventCard = e.target.closest('.event-card');
        if (eventCard) {
            var eventId = eventCard.getAttribute('data-id');
            openDetailsModal(eventId);
        }
    });

    function openDetailsModal(eventId) {
        var events = getEvents();
        var event = events.find(function(e) { return e.id === eventId; });
        
        if (!event) return;
        
        currentEventId = eventId;
        
        document.getElementById('detailsTitle').textContent = event.title;
        document.getElementById('detailsDescription').textContent = event.description || 'Sem descrição';
        
        var eventDate = new Date(event.date + 'T00:00:00');
        var dateFormatted = eventDate.toLocaleDateString('pt-BR');
        document.getElementById('detailsDateTime').textContent = '📅 ' + dateFormatted + ' • ' + event.time;
        
        document.getElementById('detailsLocation').textContent = '📍 ' + event.location;
        
        var detailsImage = document.getElementById('detailsImage');
        var detailsPlaceholder = document.getElementById('detailsPlaceholder');

        if (event.image) {
            detailsImage.src = event.image;
            detailsImage.style.display = 'block';  
            detailsPlaceholder.style.display = 'none';  
        } else {
            detailsImage.style.display = 'none';        
            detailsPlaceholder.style.display = 'block'; 
        }
        
        if (event.reminder) {
            detailsReminder.classList.add('active');
        } else {
            detailsReminder.classList.remove('active');
        }
        
        detailsModalOverlay.classList.add('active');
    }

    function closeDetailsModal() {
        detailsModalOverlay.classList.remove('active');
        currentEventId = null;
    }

    if(detailsBack) detailsBack.addEventListener('click', closeDetailsModal);
    if(detailsClose) detailsClose.addEventListener('click', closeDetailsModal);

    if(detailsModalOverlay) detailsModalOverlay.addEventListener('click', function(e) {
        if (e.target === detailsModalOverlay) {
            closeDetailsModal();
        }
    });

    if(detailsShare) detailsShare.addEventListener('click', function() {
        var events = getEvents();
        var event = events.find(function(e) { return e.id === currentEventId; });
        
        if (event) {
            var text = '🎉 ' + event.title + '\n';
            text += event.description + '\n';
            text += '📅 ' + event.date + ' • ' + event.time + '\n';
            text += '📍 ' + event.location;
            
            if (navigator.share) {
                navigator.share({
                    title: event.title,
                    text: text
                });
            } else {
                alert('Compartilhar:\n\n' + text);
            }
        }
    });

    if(detailsReminder) detailsReminder.addEventListener('click', function() {
        var events = getEvents();
        var event = events.find(function(e) { return e.id === currentEventId; });
        
        if (event) {
            event.reminder = !event.reminder;
            saveEvents(events);
            
            if (event.reminder) {
                detailsReminder.classList.add('active');
                alert('🔔 Lembrete ativado para: ' + event.title);
            } else {
                detailsReminder.classList.remove('active');
                alert('Lembrete removido');
            }
        }
    });

    if(detailsDelete) detailsDelete.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            var events = getEvents();
            events = events.filter(function(e) { return e.id !== currentEventId; });
            saveEvents(events);
            
            closeDetailsModal();
            loadAndRenderEvents();
            
            alert('Evento excluído com sucesso!');
        }
    });


    var eventImageInput = document.getElementById('eventImage');
    var imagePreviewContainer = null;

    function createImagePreviewContainer() {
        if (!imagePreviewContainer) {
            imagePreviewContainer = document.createElement('div');
            imagePreviewContainer.className = 'image-preview-container';
            imagePreviewContainer.innerHTML = '<img class="image-preview" id="imagePreview" src="" alt="Preview"><button type="button" class="remove-image-btn" id="removeImageBtn">Remover imagem</button>';
            
            if (eventImageInput && eventImageInput.parentElement) {
                eventImageInput.parentElement.appendChild(imagePreviewContainer);
                
                document.getElementById('removeImageBtn').addEventListener('click', function() {
                    eventImageInput.value = '';
                    imagePreviewContainer.style.display = 'none';
                });
            }
        }
    }

    createImagePreviewContainer();

    if(eventImageInput) {
        eventImageInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            
            if (file) {
                var reader = new FileReader();
                
                reader.onload = function(event) {
                    document.getElementById('imagePreview').src = event.target.result;
                    imagePreviewContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            }
        });
    }

    if(eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var title = document.getElementById('eventTitle').value.trim();
            var description = document.getElementById('eventDescription').value.trim();
            var date = document.getElementById('eventDate').value;
            var time = document.getElementById('eventTime').value;
            var location = document.getElementById('eventLocation').value.trim();
            var category = document.getElementById('eventCategory').value;
            var imageFile = eventImageInput.files[0];
            var category = document.getElementById('eventCategory').value;
            var isOnline = document.getElementById('eventIsOnline').checked;
            
            if (!title || !date || !time || !location || !category) {
                alert('Por favor, preencha todos os campos obrigatórios');
                return;
            }
            
            var newEvent = {
                id: 'evt_' + Date.now(),
                title: title,
                description: description,
                date: date,
                time: time,
                location: location,
                category: category,
                isImportant: false,
                reminder: false,
                image: null,
                isOnline: isOnline
            };
            
            if (imageFile) {
                var reader = new FileReader();
                
                reader.onload = function(event) {
                    newEvent.image = event.target.result;
                    saveNewEvent(newEvent);
                };
                
                reader.readAsDataURL(imageFile);

            } else {
                saveNewEvent(newEvent);
            }
        });
    }

    function saveNewEvent(event) {
        var events = getEvents();
        events.push(event);
        saveEvents(events);
        
        loadAndRenderEvents();
        closeModal();
        
        alert('Evento criado com sucesso!');
    }

    function openImportantModal() {
        const allEvents = getEvents();
        const importantEvents = allEvents.filter(event => event.isImportant);
        
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        
        const eventsProximos = importantEvents.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            return eventDate >= today;
        });
        
        importantEventsList.innerHTML = '';
        
        if (eventsProximos.length > 0) {
            eventsProximos.sort((a, b) => new Date(a.date) - new Date(b.date));
            eventsProximos.forEach(event => {
                importantEventsList.insertAdjacentHTML('beforeend', createEventCardHTML(event));
            });
        } else {
            importantEventsList.innerHTML = '<p class="empty-state">Nenhum evento importante agendado.</p>';
        }

        importantModalOverlay.classList.add('active');
    }

    function closeImportantModal() {
        importantModalOverlay.classList.remove('active');
    }

    if(showImportantFab) showImportantFab.addEventListener('click', openImportantModal);
    if(importantModalClose) importantModalClose.addEventListener('click', closeImportantModal);
    if(importantModalOverlay) importantModalOverlay.addEventListener('click', (e) => {
        if (e.target === importantModalOverlay) {
            closeImportantModal();
        }
    });

    seedEvents();
    loadAndRenderEvents();
});