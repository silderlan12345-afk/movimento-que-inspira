const API_KEY = "$2a$10$GoVUlaIRUD./ZNuu3Y1aGuuInJfmhT0MxYG52e5nRpDZr6skI6yOW";
const BIN_ID = "69d6b819856a682189119b54";

let alunos = [];
let professor = false;

// =====================
// CARREGAR DADOS
// =====================
async function carregar() {
  try {
    let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": API_KEY
      }
    });

    let data = await res.json();

    if (data && data.record) {
      alunos = data.record.alunos || [];
    } else {
      alunos = [];
    }

    atualizar();

  } catch (erro) {
    console.error("Erro ao carregar:", erro);
  }
}

// =====================
// SALVAR DADOS
// =====================
async function salvar() {
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify({ alunos })
    });

  } catch (erro) {
    console.error("Erro ao salvar:", erro);
  }
}

// =====================
// LOGIN
// =====================
function login() {
  let senha = document.getElementById("senha").value;

  if (senha === "1234") {
    professor = true;
    document.getElementById("painel").style.display = "block";
    alert("Login realizado!");
  } else {
    alert("Senha incorreta!");
  }
}

// =====================
// ADICIONAR
// =====================
async function adicionarAluno() {
  if (!professor) return;

  let nome = document.getElementById("nome").value;
  let pontos = Number(document.getElementById("pontos").value);
  let turma = document.getElementById("turma").value;

  if (!nome || isNaN(pontos)) {
    alert("Preencha corretamente!");
    return;
  }

  alunos.push({ nome, pontos, turma });

  await salvar();
  atualizar();
}

// =====================
// EDITAR
// =====================
function editarAluno(i) {
  let nome = prompt("Nome:", alunos[i].nome);
  let pontos = Number(prompt("Pontos:", alunos[i].pontos));

  if (!nome || isNaN(pontos)) return;

  alunos[i].nome = nome;
  alunos[i].pontos = pontos;

  salvar();
  atualizar();
}

// =====================
// REMOVER
// =====================
function removerAluno(i) {
  if (confirm("Excluir aluno?")) {
    alunos.splice(i, 1);
    salvar();
    atualizar();
  }
}

// =====================
// ATUALIZAR TELA
// =====================
function atualizar() {
  let ranking = document.getElementById("ranking");

  ranking.innerHTML = "";

  alunos.sort((a, b) => b.pontos - a.pontos);

  alunos.forEach((a, i) => {
    ranking.innerHTML += `
      <div style="margin:10px; padding:10px; border:1px solid #ccc;">
        ${i + 1}º - ${a.nome} (${a.pontos} pts)

        ${professor ? `
          <button onclick="editarAluno(${i})">✏️</button>
          <button onclick="removerAluno(${i})">🗑</button>
        ` : ""}
      </div>
    `;
  });
}

// =====================
// INICIAR
// =====================
carregar();
