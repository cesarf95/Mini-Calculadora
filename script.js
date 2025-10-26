document.addEventListener("DOMContentLoaded", () => {

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
  const btnsCalc = document.querySelectorAll(".btn-calc");
  const historicoEl = document.getElementById('historico');
  const soundClick = document.getElementById("soundClick");
  const soundSuccess = document.getElementById("soundSuccess");

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [{ username: "cesar", password: "123456" }];

  function salvarUsuarios() { localStorage.setItem("usuarios", JSON.stringify(usuarios)); }

  function mostrarCalculadora(username){
    soundSuccess.currentTime = 0;
    soundSuccess.play();
    loginContainer.classList.add("hidden");
    setTimeout(() => {
      loginContainer.style.display = "none";
      calcContainer.style.display = "block";
      calcContainer.classList.remove("hidden");
      calcContainer.classList.add("bounce");
      bemVindo.textContent = `Bem-vindo(a), ${username}!`;
      localStorage.setItem("ultimoUser", JSON.stringify({ username, password: passwordInput.value }));
    }, 500);
  }

  function voltarLogin(){
    calcContainer.classList.add("hidden");
    calcContainer.classList.remove("bounce");
    setTimeout(() => {
      calcContainer.style.display = "none";
      loginContainer.style.display = "block";
      loginContainer.classList.remove("hidden");
      usernameInput.value = "";
      passwordInput.value = "";
    }, 500);
  }

  function autoLogin(){
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const user = usuarios.find(u => u.username === username && u.password === password);
    if(user){ mostrarCalculadora(username); }
  }

  usernameInput.addEventListener("input", autoLogin);
  passwordInput.addEventListener("input", autoLogin);

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
    loginMsg.textContent = "Conta criada! Digite para login automático.";
    loginMsg.style.color = "green";
    usernameInput.value = "";
    passwordInput.value = "";
  });

  logoutBtn.addEventListener("click", voltarLogin);
  voltarBtn.addEventListener("click", voltarLogin);

  function atualizarHistorico(novoCalc){
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.unshift(novoCalc);
    if(historico.length > 5) historico.pop();
    localStorage.setItem('historico', JSON.stringify(historico));

    // Limpa a tela do histórico antes de mostrar os itens
    historicoEl.innerHTML = '';
    historico.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.classList.add('gradient-text');
      historicoEl.appendChild(li);
    });
  }

  function calcular(op){
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    let res = 0;
    let expressao = '';

    switch(op){
      case '+': res = num1 + num2; expressao = `${num1} + ${num2} = ${res}`; break;
      case '-': res = num1 - num2; expressao = `${num1} - ${num2} = ${res}`; break;
      case '*': res = num1 * num2; expressao = `${num1} × ${num2} = ${res}`; break;
      case '/': res = num1 / num2; expressao = `${num1} ÷ ${num2} = ${res}`; break;
      case '√': res = Math.sqrt(num1); expressao = `√${num1} = ${res}`; break;
      case '^': res = num1 ** 2; expressao = `${num1}² = ${res}`; break;
      case '%': res = (num1 * num2)/100; expressao = `${num1} % de ${num2} = ${res}`; break;
    }

    const resultadoEl = document.getElementById('resultado');
    resultadoEl.textContent = `Resultado: ${res}`;
    resultadoEl.classList.add('gradient-text');

    atualizarHistorico(expressao);
  }

  function limpar(){
    document.getElementById('num1').value = '';
    document.getElementById('num2').value = '';
    document.getElementById('resultado').textContent = 'Resultado:';
    historicoEl.innerHTML = ''; // limpa a tela do histórico
  }

  window.calcular = calcular;
  window.limpar = limpar;

  // Carrega histórico e login automático
  window.addEventListener('DOMContentLoaded', () => {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.classList.add('gradient-text');
      historicoEl.appendChild(li);
    });

    const ultimoUser = JSON.parse(localStorage.getItem("ultimoUser"));
    if(ultimoUser){
      usernameInput.value = ultimoUser.username;
      passwordInput.value = ultimoUser.password;
      autoLogin();
    }
  });

  // Partículas e som nos botões
  btnsCalc.forEach(btn => {
    btn.addEventListener("click", (e) => {
      soundClick.currentTime = 0;
      soundClick.play();
      const rect = btn.getBoundingClientRect();
      for(let i=0; i<10; i++){
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${rect.left + rect.width/2}px`;
        particle.style.top = `${rect.top + rect.height/2}px`;
        particle.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
        particle.style.setProperty('--x', `${(Math.random()-0.5)*100}px`);
        particle.style.setProperty('--y', `${-Math.random()*100}px`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    });
  });

  // Partículas seguem o mouse
  calcContainer.addEventListener("mousemove", (e) => {
    if(Math.random() > 0.9){
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      particle.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
      particle.style.setProperty('--x', `${(Math.random()-0.5)*30}px`);
      particle.style.setProperty('--y', `${(Math.random()-0.5)*30}px`);
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  });

});
