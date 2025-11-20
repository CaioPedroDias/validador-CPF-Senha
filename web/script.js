function validarCPF_Mat(cpf) {
    cpf = cpf.replace(/\D+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    // 1º dígito
    for (let i = 1; i <= 9; i++){
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[9])) return false;

    // 2º dígito
    soma = 0;
    for (let i = 1; i <= 10; i++){
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

function validarSenha_Regra(senha) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
}

// Interface UI CPF
function validarCPF_UI() {
    const cpfInput = document.getElementById("cpf");
    const resultado = document.getElementById("resCpf");

    if (cpfInput.value.trim() === "") {
        resultado.innerText = "Digite um CPF.";
        resultado.style.color = "red";
        return;
    }

    const isValido = validarCPF_Mat(cpfInput.value);

    resultado.innerText = isValido ? "CPF Válido" : "CPF Inválido";
    resultado.style.color = isValido ? "green" : "red";
}

// Interface UI Senha
function validarSenha_UI() {
    const senhaInput = document.getElementById("senha");
    const resultado = document.getElementById("resSenha");

    if (senhaInput.value.trim() === "") {
        resultado.innerText = "Digite uma senha.";
        resultado.style.color = "red";
        return;
    }

    const isForte = validarSenha_Regra(senhaInput.value);

    resultado.innerText = isForte ? "Senha forte" : "Senha fraca";
    resultado.style.color = isForte ? "green" : "red";
}
