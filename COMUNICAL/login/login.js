window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('comunical_token')) {
        window.location.href = '../calendario/calendario.html';
    }
    
    configurarEventos();
});

function configurarEventos() {
    var form = document.getElementById('loginForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            tentarLogin();
        });
    }
    
    var ajuda = document.getElementById('ajudaLink');
    if (ajuda) {
        ajuda.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Caso esqueça o acesso, fale com o responsável pelo sistema.');
        });
    }
    
    var emailInput = document.getElementById('email');
    var senhaInput = document.getElementById('senha');
    
    emailInput.addEventListener('blur', function() {
        validarEmail(emailInput.value);
    });
    
    senhaInput.addEventListener('blur', function() {
        validarSenha(senhaInput.value);
    });
}

function tentarLogin() {
    var email = document.getElementById('email').value.trim();
    var senha = document.getElementById('senha').value.trim();
    var termos = document.getElementById('termos');
    
    limparErros();
    
    if (!validarEmail(email)) {
        mostrarErro('email', 'E-mail inválido. Deve conter @ e um domínio (ex: .com)');
        return;
    }
    
    if (!validarSenha(senha)) {
        mostrarErro('senha', 'Senha inválida. Deve conter: letra maiúscula, número e caractere especial');
        return;
    }
    
    if (!termos || !termos.checked) {
        mostrarErro('termos', 'Você deve aceitar os termos de uso para continuar');
        return;
    }
    
    fazerLogin(email, senha);
}

function validarEmail(email) {
    if (email.indexOf('@') === -1) {
        return false;
    }
    
    var partes = email.split('@');
    if (partes.length !== 2) {
        return false;
    }
    
    var dominio = partes[1];
    if (dominio.indexOf('.') === -1) {
        return false;
    }
    
    var partesdominio = dominio.split('.');
    if (partesdominio[partesdominio.length - 1].length === 0) {
        return false;
    }
    
    return true;
}

function validarSenha(senha) {
    if (senha.length < 6) {
        return false;
    }
    
    var temMaiuscula = false;
    for (var i = 0; i < senha.length; i++) {
        var char = senha[i];
        if (char >= 'A' && char <= 'Z') {
            temMaiuscula = true;
            break;
        }
    }
    
    if (!temMaiuscula) {
        return false;
    }
    
    var temNumero = false;
    for (var i = 0; i < senha.length; i++) {
        var char = senha[i];
        if (char >= '0' && char <= '9') {
            temNumero = true;
            break;
        }
    }
    
    if (!temNumero) {
        return false;
    }
    
    var caracteresEspeciais = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    var temEspecial = false;
    for (var i = 0; i < senha.length; i++) {
        if (caracteresEspeciais.indexOf(senha[i]) !== -1) {
            temEspecial = true;
            break;
        }
    }
    
    if (!temEspecial) {
        return false;
    }
    
    return true;
}

function mostrarErro(campo, mensagem) {
    var input = document.getElementById(campo);
    
    if (!input) {
        alert(mensagem);
        return;
    }
    
    input.classList.add('input-error');
    
    var erroId = campo + '-erro';
    var erroExistente = document.getElementById(erroId);
    
    if (erroExistente) {
        erroExistente.textContent = mensagem;
    } else {
        var erroDiv = document.createElement('div');
        erroDiv.id = erroId;
        erroDiv.className = 'error-message';
        erroDiv.textContent = mensagem;
        
        var formGroup = input.parentElement;
        formGroup.appendChild(erroDiv);
    }
}

function limparErros() {
    var inputs = document.querySelectorAll('.input-error');
    inputs.forEach(function(input) {
        input.classList.remove('input-error');
    });
    
    var erros = document.querySelectorAll('.error-message');
    erros.forEach(function(erro) {
        erro.remove();
    });
}