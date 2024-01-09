export async function foundList(idList) {
  try {
    const reponse = await fetch(`http://localhost:3000/api/list/${idList}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("TOKEN")}`,
      },
    });
    const rep = await reponse.json();
    return rep;
  } catch (error) {
    console.error(error);
  }
}

export async function sendListToServer(listName, listToSend, userNameToSend) {
  console.log(
    "Nom de la liste:",
    listName,
    "Liste à envoyer :",
    listToSend,
    "userName :",
    userNameToSend
  );
  try {
    const reponse = await fetch("http://localhost:3000/api/list/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("TOKEN")}`,
      },
      body: JSON.stringify({
        name: listName,
        list: listToSend,
        ownerName: userNameToSend,
      }),
    });
    const rep = await reponse.json();
    return rep;
  } catch (error) {
    console.error(error.messages);
  }
}

export async function foundUser(userName) {
  try {
    const reponse = await fetch(`http://localhost:3000/api/auth/${userName}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("TOKEN")}`,
      },
    });
    const rep = await reponse.json();
    if (rep.error && rep.error.name === "TokenExpiredError") {
      alert("Erreur, veuillez vous reconnecter");
    } else {
      return rep;
    }
  } catch (error) {
    console.error(error);
  }
}
