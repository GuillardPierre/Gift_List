import { foundList, foundUser, sendListToServer } from "./indexAPI.js";
import { addEventListenerDeleteList } from "./btnsGestionList.js";

const btnCreate = document.querySelector(".addList");
const zoneCreationList = document.querySelector(".nouvelleListe");
const inputCreationList = document.querySelector(".nameNewList");
const listToComplete = document.querySelector(".listToComplete");
const followedListsZone = document.querySelector(".followedList .listOfList ");
const ownListsZone = document.querySelector(".myOwnLists .listOfList");
const nameNewList = document.querySelector(".nameNewList");
const inputNameNewList = document.querySelector("#inputNameNewList");
const btnRefreshList = document.querySelector(".btnRefreshList");

let lastListElement = "";
let allListElementsCreated = "";

let ownListsName = [];
let itemsOfOwnList = [];
let myOwnListsId = [];

let followedListName = [];
let itemsOflistFollowed = [];
let followedListsId = [];

zoneCreationList.style.display = "none";
refreshList();

//permet d'afficher ou non l'option de création de liste
btnCreate.addEventListener("click", () => {
  if (window.localStorage.getItem("connecté") != null) {
    if (zoneCreationList.style.display === "none") {
      zoneCreationList.style.display = "Block";
    } else if (zoneCreationList.style.display === "BLock") {
      zoneCreationList.style.display = "none";
    }
  }
});

inputCreationList.addEventListener(
  "keydown",
  () => {
    addListElement();
  },
  { once: true }
);

function addListElement() {
  console.log(lastListElement);
  //Après la première itération on supprime l'eventListener pour éviter troooop d'éléments dans la liste.
  if (lastListElement != "") {
    lastListElement.removeEventListener("keydown", addListElement);
  }
  //Permet de créer un nouvel élément dans la liste.
  const listElement = document.createElement("li");
  const newLine = document.createElement("input");
  newLine.type = "text";
  newLine.classList.add("newLine");
  newLine.id = "lastNewLine";
  newLine.placeholder = "Cadeau à ajouter";
  listElement.appendChild(newLine);
  listToComplete.appendChild(listElement);
  //Permet de récupérer le nouvel élément avec son id, d'ajouter un eventListener avec la même fonction
  //et de supprimer l'id du nouvel élément pour que la boucle fonctionne à la prochaine itération.
  lastListElement = document.querySelector("#lastNewLine");
  lastListElement.addEventListener("keydown", () => {
    if (newLine.value.length === 1) {
      console.log("test");
      addListElement();
    }
  });
  lastListElement.removeAttribute("id");
  //Permet de valider la liste en rajoutant un boutton à partir du moment où la liste fait plus de 1 élément.
  if (listToComplete.childElementCount === 2) {
    const btnValidation = document.createElement("button");
    btnValidation.textContent = "Appuyer ici pour valider votre liste";
    btnValidation.classList.add("listValidationBtn");
    nameNewList.appendChild(btnValidation);
    // Permet de gérer le clcik sur le bouton envoyer la liste. La fonction récupère tous les éléments des inputs pour les push dans la liste à envoyer.
    btnValidation.addEventListener("click", async function () {
      let listToSend = [];
      allListElementsCreated = document.querySelectorAll(".newLine");
      allListElementsCreated.forEach((element) => {
        if (element.value != "") {
          listToSend.push({ name: element.value });
        }
      });
      await sendListToServer(
        inputNameNewList.value,
        listToSend,
        window.localStorage.getItem("userName")
      );
      //Une fois la liste envoyée, on reset les inputs de la liste pour en recommencer une nouvelle si besoin.
      inputNameNewList.value = "";
      listToComplete.innerHTML = "";
      const btnValidationListe = document.querySelector(".listValidationBtn");
      nameNewList.removeChild(btnValidationListe);
      inputCreationList.addEventListener(
        "keydown",
        () => {
          addListElement();
        },
        { once: true }
      );
      zoneCreationList.style.display = "none";
      refreshList();
    });
  }

  //Permet de gérer la suppression des "bulles en trop"
  allListElementsCreated = document.querySelectorAll(".newLine");
  allListElementsCreated.forEach((element) => {
    element.removeEventListener("keydown", deleteListElement);
    element.addEventListener("keydown", (e) =>
      deleteListElement(e.key, element)
    );
  });
}

// Fonction qui gère la suppression d'un élément de la liste si on appuie sur effacer et que l'élément est
//déjà vide.
function deleteListElement(e, element) {
  if (e === "Backspace" && element.value.length === 0) {
    console.log("yes");
    element.remove();
  }
}

export async function refreshList() {
  if (window.localStorage.getItem("connecté") != null) {
    followedListName = [];
    itemsOflistFollowed = [];
    followedListsId = [];

    ownListsName = [];
    itemsOfOwnList = [];
    myOwnListsId = [];
    window.localStorage.removeItem("myOwnLists");
    window.localStorage.removeItem("followedList");
    const userInfo = await foundUser(
      `${window.localStorage.getItem("userName")}`
    );
    window.localStorage.setItem(
      "followedList",
      `${userInfo.listeUsers[0].listMembers}`
    );
    window.localStorage.setItem(
      "myOwnLists",
      `${userInfo.listeUsers[0].ownList}`
    );
    if (window.localStorage.getItem("myOwnLists").length > 0) {
      myOwnListsId = window.localStorage.getItem("myOwnLists").split(",");
    }
    if (window.localStorage.getItem("followedList").length > 0) {
      followedListsId = window.localStorage.getItem("followedList").split(",");
    }
    followedListsZone.innerHTML = "";
    ownListsZone.innerHTML = "";
    //Pour chacune de mes listes, j'envoie une requête pour récupérer les éléments de celle-ci.
    if (followedListsId.length != 0) {
      for (const element of followedListsId) {
        const rep = await foundList(element);
        followedListName.push(rep.name);
        itemsOflistFollowed.push(rep.list);
      }
    }
    for (let i = 0; i < followedListName.length; i++) {
      createNewListOnBoard(
        followedListName[i],
        followedListsId,
        itemsOflistFollowed[i],
        i,
        "notMyList"
      );
    }
    if (myOwnListsId.length != 0) {
      for (const element of myOwnListsId) {
        const rep = await foundList(element);
        ownListsName.push(rep.name);
        itemsOfOwnList.push(rep.list);
      }
    }
    if (ownListsName.length > 0) {
      console.log(ownListsName);
      for (let u = 0; u < ownListsName.length; u++) {
        createNewListOnBoard(
          ownListsName[u],
          myOwnListsId[u],
          itemsOfOwnList[u],
          u,
          "myList"
        );
      }
    }
    addEventListenerDeleteList();
  }
}

//Permet d'afficher des listes sur la page d'accueil. "typeList" permet de différencier ses listes
// et celles des autres.
function createNewListOnBoard(name, listId, list, i, typeList) {
  // Création de la div principale
  const giftListDiv = document.createElement("div");
  giftListDiv.classList.add("giftlist");
  giftListDiv.id = `giftlist${i}`;
  // Div avec nom de la liste
  const listName = document.createElement("div");
  listName.classList.add("name");
  listName.textContent = `${name}`;
  giftListDiv.appendChild(listName);
  // Boucle for pour chacun des éléments de la liste
  for (let u = 0; u < list.length; u++) {
    const listItemDiv = document.createElement("div");
    listItemDiv.classList.add("listItem");
    //ajout des checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = list[u].name;
    checkbox.name = "listElement";
    listItemDiv.appendChild(checkbox);
    // ajout des labels et du nom de chacun des éléments de la liste
    const label = document.createElement("label");
    label.htmlFor = list[u].name;
    label.textContent = list[u].name;

    listItemDiv.appendChild(label);
    // ajout de l'image "supprimer" pour chacune des lignes (uniquement pour le possesseur de la liste)
    if (typeList === "myList") {
      const img = document.createElement("img");
      img.src = "/Projet perso de A à Z/GiftList/images/close-button.png";
      img.alt = "delete idea";
      listItemDiv.appendChild(img);
    }
    //On ajout l'élément à la liste
    giftListDiv.appendChild(listItemDiv);
  }
  if (typeList === "myList") {
    //ajout de la ligne qui gère le rajout de lignes (uniquement pour le possesseur de la liste )
    const plusDiv = document.createElement("div");
    plusDiv.classList.add("plus");
    plusDiv.textContent = "+";
    const newElementDiv = document.createElement("div");
    newElementDiv.classList.add("newElement");
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Élement de liste ";
    newElementDiv.appendChild(inputText);
    plusDiv.appendChild(newElementDiv);
    giftListDiv.appendChild(plusDiv);

    //ajout des images de partage, refresh et suppression de liste
    const featureListDiv = document.createElement("div");
    featureListDiv.classList.add("featureList");
    const images = ["membres.png", "share.png", "refresh.png", "bin.png"];
    images.forEach((imageSrc) => {
      const img = document.createElement("img");
      const classname = imageSrc.replace(".png", "");
      img.src = `/Projet perso de A à Z/GiftList/images/${imageSrc}`;
      img.alt = imageSrc.replace(".png", "");
      img.id = listId;
      img.classList.add(classname);
      featureListDiv.appendChild(img);
    });

    // Ajouter l'élément avec la classe "featureList" à l'élément principal
    giftListDiv.appendChild(featureListDiv);
    ownListsZone.appendChild(giftListDiv);
  }
  if (typeList === "notMyList") {
    followedListsZone.appendChild(giftListDiv);
  }
}
