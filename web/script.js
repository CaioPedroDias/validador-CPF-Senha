// Função auxiliar para aplicar classe de resultado
function setResult(id, text, ok) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.classList.remove("ok", "error");
    el.classList.add(ok ? "ok" : "error");
}

/* -------------------- Validação CPF -------------------- */

function validarCPF_Mat(cpf) {
    cpf = cpf.replace(/\D+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    // 1º dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[9])) return false;

    // 2º dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

/* -------------------- Validação Senha -------------------- */

function validarSenha_Regra(senha) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
}

/* -------------------- UI CPF -------------------- */

function validarCPF_UI() {
    const cpfInput = document.getElementById("cpf");

    if (cpfInput.value.trim() === "") {
        setResult("resCpf", "Digite um CPF.", false);
        return;
    }

    const isValido = validarCPF_Mat(cpfInput.value);
    setResult("resCpf", isValido ? "CPF Válido" : "CPF Inválido", isValido);
}

/* -------------------- UI Senha -------------------- */

function validarSenha_UI() {
    const senhaInput = document.getElementById("senha");

    if (senhaInput.value.trim() === "") {
        setResult("resSenha", "Digite uma senha.", false);
        return;
    }

    const isForte = validarSenha_Regra(senhaInput.value);
    setResult("resSenha", isForte ? "Senha forte" : "Senha fraca", isForte);
}
