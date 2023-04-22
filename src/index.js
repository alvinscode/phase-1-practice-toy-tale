let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toyForm = document.querySelector(".add-toy-form");
const toyCollection = document.getElementById("toy-collection");

fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => {
      const card = createToyCard(toy);
      toyCollection.appendChild(card);
    });
  })
  .catch(error => console.error("Error fetching toys:", error));

toyForm.addEventListener("submit", event => {
  event.preventDefault();

  const nameInput = document.querySelector('input[name="name"]');
  const imageInput = document.querySelector('input[name="image"]');
  const name = nameInput.value;
  const image = imageInput.value;
  const likes = 0;

  const newToy = { name, image, likes };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy),
  })
    .then(response => response.json())
    .then(toy => {
      const card = createToyCard(toy);
      toyCollection.appendChild(card);

      nameInput.value = "";
      imageInput.value = "";
    })
    .catch(error => console.error("Error adding new toy:", error));
});

toyCollection.addEventListener("click", event => {
  if (event.target.classList.contains("like-btn")) {
    const id = event.target.id;
    const likesElement = event.target.previousElementSibling;
    let likes = parseInt(likesElement.textContent) || 0;
    likes++;

    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes }),
    })
      .then(response => response.json())
      .then(toy => {
        likesElement.textContent = `${toy.likes} likes`;
      })
      .catch(error => console.error("Error", error));
  }
});

function createToyCard(toy) {
  const card = document.createElement("div");
  card.classList.add("card");

  const name = document.createElement("h2");
  name.textContent = toy.name;

  const image = document.createElement("img");
  image.src = toy.image;
  image.classList.add("toy-avatar");

  const likes = document.createElement("p");
  likes.textContent = `${toy.likes} likes`;

  const likeButton = document.createElement("button");
  likeButton.textContent = "Like ❤️";
  likeButton.classList.add("like-btn");
  likeButton.id = toy.id;

  card.append(name, image, likes, likeButton);

  return card;
}