import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let alunos = [];
let professor = false;
let chart = null;

// ELEMENTOS
const ranking = document.getElementById("ranking");
const podio = document.getElementById("podio");
const rankingTurma = document.getElementById("rankingTurma");
const filtroTurma = document.getElementById("filtroTurma");
const textoDesafio = document.getElementById("textoDesafio");
const painel = document.getElementById("painel");

document.getElementById("btnLogin").onclick = login;
document.getElementById("btnAdicionar").onclick = adicionarAluno;
document.getElementById("btnDesafio").onclick = criarDesafio;
document.getElementById("btnTelao").onclick = modoTelao;
filtroTurma.onchange = filtrarTurma;

// LOGIN
function login() {
  const senha = document.getElementById("senha").value;

  if (senha === "professor123") {
    professor = true;
    painel.style.display = "block";
    alert("Login realizado");
  } else {
    alert("Senha incorreta");
  }
}

// ADICIONAR
async function adicionarAluno() {
  if (!professor) return;

  const nome = document.getElementById("nome").value;
  const pontos = Number(document.getElementById("pontos").value);
  const turma = document.getElementById("turma").value;
  const foto = document.getElementById("foto").value || "https://via.placeholder.com/100";

  await addDoc(collection(db, "alunos"), {
    nome,
    pontos,
    turma,
    foto,
    historico: [pontos]
  });
}

// EDITAR
window.editarAluno = async (id) => {
  const aluno = alunos.find(a => a.id === id);

  let nome = prompt("Nome:", aluno.nome);
  let pontos = Number(prompt("Pontos:", aluno.pontos));

  await updateDoc(doc(db, "alunos", id), {
    nome,
    pontos,
    historico: [...aluno.historico, pontos]
  });
};

// REMOVER
window.removerAluno = async (id) => {
  if (confirm("Excluir aluno?")) {
    await deleteDoc(doc(db, "alunos", id));
  }
};

// MEDALHAS
function medalha(p) {
  if (p >= 100) return "🏆 Campeão";
  if (p >= 60) return "🔥 Super Ativo";
  if (p >= 30) return "💪 Dedicado";
  if (p >= 10) return "🏃 Iniciante";
  return "";
}

// ATUALIZAR TELA
function atualizar() {
  ranking.innerHTML = "";
  podio.innerHTML = "";

  alunos.sort((a, b) => b.pontos - a.pontos);

  alunos.forEach((a, i) => {
    let medal = ["🥇", "🥈", "🥉"];

    let card = `
    <div class="card">
      <h3>${i < 3 ? medal[i] : ""} ${a.nome}</h3>
      <img class="foto" src="${a.foto}">
      <p>${a.pontos} pontos</p>
      <p>${medalha(a.pontos)}</p>

      ${professor ? `
        <button onclick="editarAluno('${a.id}')">Editar</button>
        <button onclick="removerAluno('${a.id}')">Excluir</button>
      ` : ""}
    </div>
    `;

    if (i < 3) podio.innerHTML += card;
    ranking.innerHTML += card;
  });

  grafico();
  filtrarTurma();
}

// FILTRO
function filtrarTurma() {
  let turma = filtroTurma.value;

  rankingTurma.innerHTML = "";

  let lista = turma === "todas"
    ? alunos
    : alunos.filter(a => a.turma === turma);

  lista.forEach(a => {
    rankingTurma.innerHTML += `
    <div class="card">
      <h3>${a.nome}</h3>
      <img class="foto" src="${a.foto}">
      <p>${a.pontos} pontos</p>
    </div>
    `;
  });
}

// GRÁFICO
function grafico() {
  let ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: alunos.map(a => a.nome),
      datasets: [{
        label: "Pontuação",
        data: alunos.map(a => a.pontos)
      }]
    }
  });
}

// DESAFIO
async function criarDesafio() {
  let texto = document.getElementById("desafioInput").value;

  await setDoc(doc(db, "config", "desafio"), {
    texto
  });
}

// TELÃO
function modoTelao() {
  document.body.style.fontSize = "24px";
  document.body.style.background = "#000";
}

// TEMPO REAL 🔥
onSnapshot(query(collection(db, "alunos"), orderBy("pontos", "desc")), (snap) => {
  alunos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  atualizar();
});

onSnapshot(doc(db, "config", "desafio"), (snap) => {
  if (snap.exists()) {
    textoDesafio.innerText = snap.data().texto;
  }
});
