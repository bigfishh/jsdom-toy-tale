const toyGetRequest = "http://localhost:3000/toys"
let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection")
  const form = document.querySelector(".add-toy-form")
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
// });

// 1. create a function to get the toys 
// 2. inside of this function, make a get request to localhost
// 3. after the request, iterate through the response and render each element in the response collectin to the DOM  

function getToy() {
  fetch(toyGetRequest)
  .then(resp => resp.json())
  .then(toysObject => {
    toysObject.forEach((toy) => {
      renderToy(toy)
    })
  })
}

// helper function to render toys from fetch
function renderToy(toy) {
  const div = document.createElement('div')
  div.dataset.id = toy.id
  div.classList.add('card')
  let {name, image, likes} = toy
  div.innerHTML= `
    <h2>${name}</h2>
    <img src=${image} class="toy-avatar" />
    <p>${likes} Likes </p>
    <button class="like-btn">Like <3</button>`
  toyCollection.append(div)
}

getToy()

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = event.target.name.value
  const image = event.target.image.value
  fetch(toyGetRequest, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      name,
      image,
      likes: 0
    })
  })
  .then(resp => resp.json())
  .then(newToy => {
    renderToy(newToy)
    event.target.reset()
  })
})

// 1. listen for a click event on the toy collection b/c it has all the toys (bubbling~)
toyCollection.addEventListener("click", (event) => {
  if (event.target.matches("button.like-btn")) {
    const div = event.target.closest('div')
    const pLikes = event.target.previousElementSibling
    const newLikes = parseInt(pLikes.textContent) + 1
    fetch(`${toyGetRequest}/${div.dataset.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(resp => resp.json())
    .then(data => pLikes.textContent = `${data.likes} Likes`)
  }
})