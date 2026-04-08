const API_KEY = "$2a$10$GoVUlaIRUD./ZNuu3Y1aGuuInJfmhT0MxYG52e5nRpDZr6skI6yOW";
const BIN_ID = "69d6b819856a682189119b54";

let alunos = [];
let desafio = "";
let professor = false;
let chart;

// =================
// CARREGAR
// =================
async function carregar() {

let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
headers: { "X-Master-Key": API_KEY }
});

let data = await res.json();

alunos = data.record.alunos || [];
desafio = data.record.desafio || "";

document.getElementById("textoDesafio").innerText = desafio;

atualizar();
}

// =================
// SALVAR
// =================
async function salvar() {

await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
"X-Master-Key": API_KEY
},
body: JSON.stringify({ alunos, desafio })
});
}

// =================
// LOGIN
// =================
function login(){

if(document.getElementById("senha").value=="1234"){
professor=true;
document.getElementById("painel").style.display="block";
}
}

// =================
// ADICIONAR
// =================
async function adicionarAluno(){

if(!professor) return;

let nome=document.getElementById("nome").value;
let pontos=Number(document.getElementById("pontos").value);
let turma=document.getElementById("turma").value;

alunos.push({nome,pontos,turma});

await salvar();
carregar();
}

// =================
// DESAFIO
// =================
async function criarDesafio(){

if(!professor) return;

desafio=document.getElementById("desafioInput").value;

await salvar();

document.getElementById("textoDesafio").innerText=desafio;
}

// =================
// ATUALIZAR
// =================
function atualizar(){

let ranking=document.getElementById("ranking");
ranking.innerHTML="";

alunos.sort((a,b)=>b.pontos-a.pontos);

alunos.forEach((a,i)=>{
ranking.innerHTML+=`<div>${i+1} - ${a.nome} (${a.pontos})</div>`;
});

filtrarTurma();
grafico();
}

// =================
// FILTRO
// =================
function filtrarTurma(){

let turma=document.getElementById("filtroTurma").value;
let div=document.getElementById("rankingTurma");

div.innerHTML="";

let lista = turma=="todas"?alunos:alunos.filter(a=>a.turma==turma);

lista.forEach(a=>{
div.innerHTML+=`<div>${a.nome} - ${a.pontos}</div>`;
});
}

// =================
// GRÁFICO
// =================
function grafico(){

let ctx=document.getElementById("grafico");

if(chart) chart.destroy();

chart=new Chart(ctx,{
type:"bar",
data:{
labels:alunos.map(a=>a.nome),
datasets:[{
label:"Pontuação",
data:alunos.map(a=>a.pontos)
}]
}
});
}

// =================
carregar();
