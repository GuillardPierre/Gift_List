import { refreshList } from "./index.js";

export async function addEventListenerDeleteList() {
  let allDeleteBtns = document.querySelectorAll(".bin");
  console.log(allDeleteBtns);
  allDeleteBtns.forEach((element) => {
    // element.removeEventListener("click", deleteList)
    element.addEventListener("click", async () => {
      const rep = await deleteList(element.id);
      if (rep && rep.message === "Liste supprimée") {
        console.log("yes");
        refreshList();
        return rep.message;
      } else if (rep && rep.message != "Liste supprimée") {
        alert("erreur lors de la suppression de liste");
      }
    });
  });
}

export async function deleteList(id) {
  console.log(id);
  try {
    const reponse = await fetch(`http://localhost:3000/api/list/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("TOKEN")}`,
      },
    });
    const rep = await reponse.json();
    console.log(rep);
    return rep;
  } catch (error) {
    console.error(error);
  }
}
