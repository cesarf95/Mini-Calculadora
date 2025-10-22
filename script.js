const loginContainer = document.getElementById("login-container");
const calcContainer = document.getElementById("calc-container");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginMsg = document.getElementById("loginMsg");
const bemVindo = document.getElementById("bemVindo");
const voltarBtn = document.getElementById("voltarBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Recupera contas
let contas = JSON.parse(localStorage.getItem("contas")) || [];
let usuarioLogado = null;

// Criar conta
registerBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    loginMsg.textContent = "Preencha todos os campos!";
    return;
  }

  if (contas.find(c => c.user === user)) {
    loginMsg.textContent = "Usuário já existe!";
    return;
  }

  contas.push({ user, pass });
  localStorage.setItem("contas", JSON.stringify(contas));
  loginMsg.textContent = "Conta criada com sucesso! Faça login.";
});

// Login
loginBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  const conta = contas.find(c => c.user === user && c.pass === pass);
  if (conta) {
    usuarioLogado = user;
    loginContainer.style.display = "none";
    calcContainer.style.display = "block";
    bemVindo.textContent = `👋 Bem-vindo, ${user}!`;
    loginMsg.textContent = "";
  } else {
    loginMsg.textContent = "Usuário ou senha incorretos!";
  }
});

// Voltar (sair da calculadora mas manter login ativo)
voltarBtn.addEventListener("click", () => {
  calcContainer.style.display = "none";
  loginContainer.style.display = "block";
  loginMsg.textContent = "Você saiu da calculadora, mas ainda está logado.";
});

// Logout total (limpa sessão)
logoutBtn.addEventListener("click", () => {
  usuarioLogado = null;
  calcContainer.style.display = "none";
  loginContainer.style.display = "block";
  loginMsg.textContent = "Logout realizado com sucesso!";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
});

// Calculadora
function calcular(op) {
  const n1 = parseFloat(document.getElementById("num1").value);
  const n2 = parseFloat(document.getElementById("num2").value);
  let resultado;

  switch (op) {
    case "+": resultado = n1 + n2; break;
    case "-": resultado = n1 - n2; break;
    case "*": resultado = n1 * n2; break;
    case "/": resultado = n2 !== 0 ? n1 / n2 : "Erro (divisão por 0)"; break;
    case "√": resultado = n1 >= 0 ? Math.sqrt(n1) : "Inválido"; break;
    case "^": resultado = Math.pow(n1, 2); break;
    case "%": resultado = (n1 / 100) * n2; break;
    default: resultado = "Operação inválida";
  }

  document.getElementById("resultado").innerText = `Resultado: ${resultado}`;
}

function limpar() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("resultado").innerText = "Resultado:";
}
