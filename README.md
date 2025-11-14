# CPF & Senha Validator — Demo Jenkins

Projeto demo para seminário de Teste de Software. Testes automatizados "à mão" (sem frameworks) e pipeline Jenkins.

## Estrutura
- `src/validator.js` — validações (CPF e senha)
- `tests/test.js` — testes automatizados (usa assert)
- `web/index.html` — UI simples para demo visual
- `package.json` — script `npm test`
- `Jenkinsfile` — pipeline declarative (checkout, prepare, run tests, archive)

## Requisitos
- Node.js instalado no agente Jenkins (ou em máquina local)
- Jenkins com acesso ao repositório (Git)
- Permissões para executar `sh` no executor (ou adapte para `bat` no Windows)

## Rodando localmente
1. `npm install` (opcional, não há dependências)
2. `npm test` ou `node tests/test.js`
   - Saída esperada: `Todos os testes passaram ✅` e exit code 0

3. Abrir `web/index.html` no navegador para demo visual.

## Configurando no Jenkins
- Crie um pipeline apontando para o repositório.
- Pipeline já contém `checkout scm` e `sh 'node tests/test.js'`.
- Rode o build. Se algum teste falhar, o job ficará em **FAIL** (exit code 1).

## Como forçar uma falha (útil para demo)
1. Localmente altere um assert em `tests/test.js` (ex.: mude `true` para `false` na primeira linha de teste).
2. Commit & push.
3. Rode o job no Jenkins → vai aparecer vermelho.
4. Volte a correção, commit & push de novo → pipeline verde.
