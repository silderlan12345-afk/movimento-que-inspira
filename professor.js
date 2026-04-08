
function login(){

let senha=document.getElementById("senha").value

if(senha==="professor123"){

document.getElementById("painel").style.display="block"

alert("Login realizado!")

}

else{

alert("Senha incorreta")

}

}