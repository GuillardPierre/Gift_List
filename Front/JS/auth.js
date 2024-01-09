//Partie connexion
const connexionContainer = document.querySelector(".connexionConteneur");
const inputEmail = document.getElementById("userEmail");
const inputPassword = document.getElementById("userPassword");
const allInput = document.querySelectorAll(".connexionConteneur input");
const btnEnvoyer = document.getElementById("seConnecter");
const btnFormulaireCreationCompte = document.querySelector(
  ".optionCreationCompte span"
);

//Partie création compte
const zoneCreationCompte = document.querySelector(".creationCompte");
const inputPrenom = document.getElementById("prenom");
const inputNom = document.getElementById("nom");
const inputSignupEmail = document.getElementById("signupEmail");
const inputSignupPassword = document.getElementById("signupPassword");
const btnCreationCompte = document.getElementById("creerCompte");

//Partie utilisateur connecté
const userProfil = document.querySelector(".userProfil");
const zoneUsername = document.querySelector(".user span");
const btnDeconnexion = document.querySelector(".deconnexion");

userProfil.style.display = "none";
zoneCreationCompte.style.display = "none";

async function connexionRequest(email, password) {
  try {
    const reponse = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    const rep = await reponse.json();
    return rep;
  } catch (error) {
    console.error("erreur:", error.messages);
    throw error;
  }
}

async function signupRequest(username, email, password) {
  console.log(username, email, password);
  try {
    const reponse = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: username,
        email: email,
        password: password,
        ownList: [],
        listMembers: [],
      }),
    });
    const rep = await reponse.json();
    return rep;
  } catch (error) {
    console.error("erreur", error.messages);
  }
}

async function connexionLocal() {
  const email = inputEmail.value;
  const password = inputPassword.value;
  const rep = await connexionRequest(email, password);
  if (rep.connected === true) {
    console.log(rep);
    zoneUsername.innerHTML = `${rep.userName}`;
    connexionContainer.style.display = "none";
    userProfil.style.display = "inline";
    window.localStorage.setItem("connecté", "true");
    window.localStorage.setItem("userEmail", `${rep.email}`);
    window.localStorage.setItem("userName", `${rep.userName}`);
    window.localStorage.setItem("TOKEN", `${rep.token}`);
    window.localStorage.setItem("followedList", `${rep.listMembers}`);
    window.localStorage.setItem("myOwnLists", `${rep.ownList}`);
    allInput.forEach((element) => {
      element.style.border = "1px solid";
    });
  } else {
    alert("Paire mail/mot de passe incorrecte");
    allInput.forEach((element) => {
      element.style.border = "1px solid red";
    });
  }
}

async function signupLocal() {
  const username = inputPrenom.value + " " + inputNom.value;
  const email = inputSignupEmail.value;
  const password = inputSignupPassword.value;
  const rep = await signupRequest(username, email, password);
  console.log(rep);
  if (rep.signup === true) {
    zoneCreationCompte.style.display = "none";
    connexionContainer.style.display = "block";
  }
}

function deconnexion() {
  window.localStorage.removeItem("connecté");
  window.localStorage.removeItem("userEmail");
  window.localStorage.removeItem("userName");
  window.localStorage.removeItem("TOKEN");
  window.localStorage.removeItem("followedList");
  window.localStorage.removeItem("myOwnLists");
  connexionContainer.style.display = "block";
  userProfil.style.display = "none";
  inputEmail.value = "";
  inputPassword.value = "";
}

btnEnvoyer.addEventListener("click", connexionLocal);
btnDeconnexion.addEventListener("click", deconnexion);
btnFormulaireCreationCompte.addEventListener("click", () => {
  zoneCreationCompte.style.display = "block";
  connexionContainer.style.display = "none";
});
btnCreationCompte.addEventListener("click", signupLocal);

//Prise en compte si un utilisateur est déjà connecté ou non
if (window.localStorage.getItem("connecté") === "true") {
  zoneUsername.innerHTML = window.localStorage.getItem("userName");
  connexionContainer.style.display = "none";
  userProfil.style.display = "inline";
}
