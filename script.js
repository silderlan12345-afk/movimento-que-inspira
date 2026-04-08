let alunos = JSON.parse(localStorage.getItem("alunos")) || []
let atividades = JSON.parse(localStorage.getItem("atividades")) || []

let professor=false

function salvar(){

localStorage.setItem("alunos",JSON.stringify(alunos))

}

function login(){

let senha=document.getElementById("senha").value

if(senha==="professor123"){

professor=true
document.getElementById("painel").style.display="block"
alert("Login realizado")

}

}

function adicionarAluno(){

if(!professor) return

let nome=document.getElementById("nome").value
let pontos=Number(document.getElementById("pontos").value)
let turma=document.getElementById("turma").value
let fotoInput=document.getElementById("foto")

let reader=new FileReader()

reader.onload=function(){

let foto=reader.result

alunos.push({

nome:nome,
pontos:pontos,
foto:foto,
turma:turma,
historico:[pontos]

})

salvar()
atualizar()

}

reader.readAsDataURL(fotoInput.files[0])

}

function removerAluno(i){

if(!professor) return

if(confirm("Excluir aluno?")){

alunos.splice(i,1)
salvar()
atualizar()

}

}

function editarAluno(i){

if(!professor) return

let novoNome=prompt("Nome:",alunos[i].nome)
let novosPontos=prompt("Pontos:",alunos[i].pontos)

alunos[i].nome=novoNome
alunos[i].pontos=Number(novosPontos)

alunos[i].historico.push(Number(novosPontos))

salvar()
atualizar()

}

function medalha(pontos){

if(pontos>=100) return "🏆 Campeão"
if(pontos>=60) return "🔥 Super Ativo"
if(pontos>=30) return "💪 Dedicado"
if(pontos>=10) return "🏃 Iniciante"

return ""

}

function atualizar(){

alunos.sort((a,b)=>b.pontos-a.pontos)

let ranking=document.getElementById("ranking")
let podio=document.getElementById("podio")

ranking.innerHTML=""
podio.innerHTML=""

alunos.forEach((a,i)=>{

let medalhaEmoji=["🥇","🥈","🥉"]

let card=`

<div class="card">

<h3>${i<3?medalhaEmoji[i]:""} ${a.nome}</h3>

<img class="foto" src="${a.foto}">

<p>${a.pontos} pontos</p>

<p>${medalha(a.pontos)}</p>

${professor?`

<button onclick="editarAluno(${i})">Editar</button>
<button onclick="removerAluno(${i})">Excluir</button>

`:""}

</div>

`

if(i<3){

podio.innerHTML+=card

}

ranking.innerHTML+=card

})

grafico()

}

function grafico(){

let ctx=document.getElementById("grafico")

let nomes=alunos.map(a=>a.nome)
let pontos=alunos.map(a=>a.pontos)

new Chart(ctx,{

type:"bar",

data:{

labels:nomes,

datasets:[{

label:"Pontuação",

data:pontos

}]

}

})

}

function filtrarTurma(){

let turma=document.getElementById("filtroTurma").value
let rankingTurma=document.getElementById("rankingTurma")

rankingTurma.innerHTML=""

let lista = turma=="todas"
? alunos
: alunos.filter(a=>a.turma==turma)

lista.forEach(a=>{

rankingTurma.innerHTML+=`

<div class="card">

<h3>${a.nome}</h3>

<img class="foto" src="${a.foto}">

<p>${a.pontos} pontos</p>

<p>Turma ${a.turma}</p>

</div>

`

})

}

function criarDesafio(){

let texto=document.getElementById("desafioInput").value

localStorage.setItem("desafioSemana",texto)

document.getElementById("textoDesafio").innerText=texto

}

function carregarDesafio(){

let desafio=localStorage.getItem("desafioSemana")

if(desafio){

document.getElementById("textoDesafio").innerText=desafio

}

}

carregarDesafio()

function modoTelao(){

document.body.style.fontSize="24px"
document.body.style.background="#000"

alert("Modo Telão ativado")

}

atualizar()