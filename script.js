document.addEventListener("DOMContentLoaded", () => {

  // Fundo animado VANTA.NET
  VANTA.NET({
    el: "#fundo",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x2575fc,
    backgroundColor: 0x000000
  });

  const loginContainer = document.getElementById('login-container');
  const calcContainer = document.getElementById('calc-container');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginMsg = document.getElementById('loginMsg');
  const bemVindo = document.getElementById('bemVindo');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const voltarBtn = document.getElementById('voltarBtn');

  // Array de usuários armazenados
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    { username: "cesar", password: "123456" }
  ];

  // Atualiza localStorage
  function salvarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  // Login automático
  function autoLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const user = usuarios.find(u => u.username === username && u.password === password);

    if(user){
      loginContainer.style.display = "none";
      calcContainer.style.display = "block";
      bemVindo.textContent = `Bem-vindo(a), ${username}!`;
      loginMsg.textContent = "";
      localStorage.setItem("ultimoUser", JSON.stringify({ username, password }));
    }
  }

  // Dispara login sempre que o usuário digita
  usernameInput.addEventListener("input", autoLogin);
  passwordInput.addEventListener("input", autoLogin);

  // Criar conta
  registerBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if(!username || !password){
      loginMsg.textContent = "Preencha usuário e senha!";
      loginMsg.style.color = "red";
      return;
    }

    if(usuarios.find(u => u.username === username)){
      loginMsg.textContent = "Usuário já existe!";
      loginMsg.style.color = "red";
      return;
    }

    usuarios.push({ username, password });
    salvarUsuarios();
    loginMsg.textContent = "Conta criada! Digite novamente para login automático.";
    loginMsg.style.color = "green";
    usernameInput.value = "";
    passwordInput.value = "";
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    calcContainer.style.display = "none";
    loginContainer.style.display = "block";
    usernameInput.value = "";
    passwordInput.value = "";
  });

  // Voltar
  voltarBtn.addEventListener("click", () => {
    calcContainer.style.display = "none";
    loginContainer.style.display = "block";
    usernameInput.value = "";
    passwordInput.value = "";
  });

  // Calculadora
  function calcular(op){
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    let res = 0;

    switch(op){
      case '+': res = num1 + num2; break;
      case '-': res = num1 - num2; break;
      case '*': res = num1 * num2; break;
      case '/': res = num1 / num2; break;
      case '√': res = Math.sqrt(num1); break;
      case '^': res = num1 ** 2; break;
      case '%': res = (num1 * num2)/100; break;
    }
    document.getElementById('resultado').textContent = `Resultado: ${res}`;
  }

  function limpar(){
    document.getElementById('num1').value = '';
    document.getElementById('num2').value = '';
    document.getElementById('resultado').textContent = 'Resultado:';
  }

  window.calcular = calcular;
  window.limpar = limpar;

  // Preenche automaticamente campos do último usuário salvo
  const ultimoUser = JSON.parse(localStorage.getItem("ultimoUser"));
  if(ultimoUser){
    usernameInput.value = ultimoUser.username;
    passwordInput.value = ultimoUser.password;
    autoLogin();
  }

});
