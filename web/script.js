function validarCPF_UI() {
    const cpf = document.getElementById("cpf").value;
    const somenteNumeros = cpf.replace(/[^\d]/g, "");

    const valido = somenteNumeros.length === 11;
    document.getElementById("resCpf").innerText =
        valido ? "Formato válido (apenas visual)" : "Formato inválido";
}

function validarSenha_UI() {
    const senha = document.getElementById("senha").value;

    const condicoes =
        senha.length >= 8 &&
        /[A-Z]/.test(senha) &&
        /[a-z]/.test(senha) &&
        /[0-9]/.test(senha) &&
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(senha);

    document.getElementById("resSenha").innerText =
        condicoes ? "Senha forte (visual)" : "Senha fraca";
}
