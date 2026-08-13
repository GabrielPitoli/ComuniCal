const TOKEN_FIXO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzdcOhcmlvIENPTVVOSUNBTCIsImVtYWlsIjoidXN1YXJpb0Bjb211bmljYWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.TcslmV4cCI6MTc1OTk4NDQwNDkxODMsInN1YiI6ImFkbWluQGNvbXVuaWNhbC5jb20ifQ';

function verificarLogin() {
    const token = localStorage.getItem('comunical_token');
    
    if (!token) {
        window.location.href = '../login/login.html';
    }
}

function verificarOrdem() {
    const token = localStorage.getItem('comunical_token');
    
    if (!token) {
        window.location.href = '../login/login.html';
        return;
    }
    
    const passouCalendario = localStorage.getItem('passou_calendario');
    
    if (!passouCalendario) {
        window.location.href = '../calendario/calendario.html';
    }
}

function fazerLogin(email, senha) {
    if (!email || !senha) {
        alert('Preencha todos os campos');
        return false;
    }
    
    localStorage.setItem('comunical_token', TOKEN_FIXO);
    window.location.href = '../calendario/calendario.html';
    return true;
}

function fazerLogout() {
    if (confirm('Deseja sair do aplicativo?')) {
        localStorage.removeItem('comunical_token');
        localStorage.removeItem('passou_calendario');
        window.location.href = '../login/login.html';
    }
}

function marcarCalendario() {
    localStorage.setItem('passou_calendario', 'sim');
}

