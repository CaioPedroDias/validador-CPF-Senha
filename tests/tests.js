// Runner de testes que gera:
//  - test-results/result.txt  (resumo legível)
//  - test-results/junit.xml   (JUnit XML para Jenkins)
// Exit code: 0 = OK, 1 = alguma falha

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const resultsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
const outTxt = path.join(resultsDir, 'result.txt');
const outJUnit = path.join(resultsDir, 'junit.xml');

function writeResultTxt(text) {
  fs.writeFileSync(outTxt, text, 'utf8');
  console.log('\n=== Test Results written to', outTxt, '===\n');
}

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Funções a testar (mesma lógica do script.js)

function validarCPF_Mat(cpf) {
    cpf = String(cpf).replace(/\D+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    // 1º dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[9], 10)) return false;

    // 2º dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[10], 10)) return false;

    return true;
}

function validarSenha_Regra(senha) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(String(senha));
}

// Casos de teste

const suites = [
  {
    name: 'CPF Suite',
    run: () => {
      // Casos válidos
      assert.strictEqual(validarCPF_Mat('529.982.247-25'), true, 'CPF válido (com pontuação) falhou');
      assert.strictEqual(validarCPF_Mat('52998224725'), true, 'CPF válido (sem pontuação) falhou');

      // Casos inválidos
      assert.strictEqual(validarCPF_Mat('000.000.000-00'), false, 'Sequência 0 deveria ser inválida');
      assert.strictEqual(validarCPF_Mat('11111111111'), false, 'Sequência repetida deveria ser inválida');
      assert.strictEqual(validarCPF_Mat('123'), false, 'CPF curto deveria falhar');
      assert.strictEqual(validarCPF_Mat('abcdefghijk'), false, 'CPF com letras deveria falhar');
      assert.strictEqual(validarCPF_Mat('529.982.247-26'), false, 'CPF com dígito verificador incorreto deveria falhar');
      return true;
    }
  },

  {
    name: 'Senha Suite',
    run: () => {
      // Válidas
      assert.strictEqual(validarSenha_Regra('Aa123456@'), true, 'Senha "Aa123456@" (válida) falhou');
      assert.strictEqual(validarSenha_Regra('Senha@2024'), true, 'Senha "Senha@2024" (válida) falhou');
      assert.strictEqual(validarSenha_Regra('Testando1!'), true, 'Senha "Testando1!" (válida) falhou');

      // Inválidas
      assert.strictEqual(validarSenha_Regra('abcdef12'), false, 'Sem maiúscula deveria falhar');
      assert.strictEqual(validarSenha_Regra('ABCDEF12'), false, 'Sem minúscula deveria falhar');
      assert.strictEqual(validarSenha_Regra('Abcdefgh'), false, 'Sem número deveria falhar');
      assert.strictEqual(validarSenha_Regra('Aa123456'), false, 'Sem caractere especial deveria falhar');
      assert.strictEqual(validarSenha_Regra('Aa1@'), false, 'Muito curta (menos de 8) deveria falhar');
      return true;
    }
  }
];

// Runner e geração JUnit

(async () => {
  const results = [];
  let total = 0;
  let failures = 0;
  let txtLines = [];

  for (const suite of suites) {
    total += 1;
    try {
      console.log(`Running ${suite.name}...`);
      suite.run();
      results.push({ name: suite.name, ok: true });
      txtLines.push(`${suite.name}: OK`);
    } catch (err) {
      failures += 1;
      results.push({ name: suite.name, ok: false, error: err.message || String(err) });
      txtLines.push(`${suite.name}: FAILED -> ${err.message || String(err)}`);
      console.error(`${suite.name} FAILED:`, err && err.stack ? err.stack : err);
    }
  }

  // Escreve result.txt
  const summary = `Total suites: ${total}\nFailures: ${failures}\n\n` + txtLines.join('\n') + '\n';
  writeResultTxt(summary);

  // Gera junit.xml simples
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<testsuites tests="${total}" failures="${failures}">\n`;
  xml += `  <testsuite name="ValidadorSuite" tests="${total}" failures="${failures}">\n`;

  for (const r of results) {
    const tcName = escapeXml(r.name);
    if (r.ok) {
      xml += `    <testcase classname="validador" name="${tcName}" />\n`;
    } else {
      xml += `    <testcase classname="validador" name="${tcName}">\n`;
      xml += `      <failure message="${escapeXml(r.error || 'failed')}">${escapeXml(r.error || '')}</failure>\n`;
      xml += `    </testcase>\n`;
    }
  }

  xml += '  </testsuite>\n';
  xml += '</testsuites>\n';

  fs.writeFileSync(outJUnit, xml, 'utf8');
  console.log('JUnit XML written to', outJUnit);

  // Sai com código apropriado
  if (failures > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
