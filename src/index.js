import './../style/main.scss';

let dataBase = 'http://localhost:3000/data';

let modalBtn = document.getElementById('create-recipe');
let canselModal = document.getElementById('cancel');
const form = document.getElementById('form-recipe');
const contentItem = document.getElementById('content-item');
const container = document.getElementById('content-list');

modalBtn.addEventListener('click', () => {
  form.style.zIndex = 5;
  form.style.opacity = 1;
});
const hideModalHendler = () => {
  form.style.zIndex = -5;
  form.style.opacity = 0;
};
canselModal.addEventListener('click', hideModalHendler);

const getDataBase = () => {
  fetch(dataBase)
    .then((response) => response.json())
    .then((response) => {
      response.forEach((data) => {
        addRecipe(data.image, data.name, data.description, 'ingredients' in data ? data.ingredients : []);
      });
    });
};

getDataBase();

function addRecipe(image, name, description, ingredients) {
  let div = document.createElement('div');
  let img = document.createElement('img');
  let text = document.createElement('p');
  let descr = document.createElement('p');
  let ulConteiner = document.createElement('ul');
  img.src = image;
  text.innerText = name;
  descr.innerText = description;
  for (let item of ingredients) {
    let conteiner = document.createElement('li');
    let image = document.createElement('img');
    let name = document.createElement('p');
    let amount = document.createElement('p');
    image.src = item.image;
    name.innerHTML = item.name;
    amount.innerText = item.amount;
    conteiner.appendChild(image);
    conteiner.appendChild(name);
    conteiner.appendChild(amount);
    ulConteiner.appendChild(conteiner);
  }
  text.classList.add('image-text');
  descr.classList.add('description-text');
  img.classList.add('image-kitchen');
  div.classList.add('image-wrap');
  ulConteiner.classList.add('ingredients');
  div.appendChild(img);
  div.appendChild(text);
  div.appendChild(descr);
  div.appendChild(ulConteiner);
  img.addEventListener('click', addOutputHendler);
  container.appendChild(div);
}


function modalViewRicipe(event) {
  let div = document.createElement('div');
  div.innerHTML = event.target.parentElement.innerHTML;
  let closeModalViewRecipe = document.createElement('button');
  closeModalViewRecipe.innerText = 'close recipe';
  closeModalViewRecipe.classList.add('close-recipe');
  div.appendChild(closeModalViewRecipe);
  closeModalViewRecipe.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    e.stopPropagation();
  });
  div.classList.add('modal-view-ricipe');
  container.appendChild(div);
  event.stopPropagation();
}
let addOutputHendler = (e) => {
  if (e.target.tagName === 'IMG') {
    contentItem.innerHTML = '';
    let div = document.createElement('div');
    div.innerHTML = e.target.parentElement.innerHTML;
    let btnViewRecipe = document.createElement('button');
    btnViewRecipe.innerText = 'view recipe';
    btnViewRecipe.classList.add('btn-view-recipe');
    div.appendChild(btnViewRecipe);
    btnViewRecipe.addEventListener('click', modalViewRicipe);
    div.classList.add('image-wrap');
    contentItem.appendChild(div);
    e.stopPropagation();
  }
};

function addRecipeToServer(image, name, description, ingredients) {
  let obj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image,
      name,
      description,
      ingredients,
    }),
  };
  fetch(dataBase, obj);
}

const addRecipeHandler = (event) => {
  event.preventDefault();
  let url = form.url.value;
  let text = form.recipe_text.value;
  let descr = form.description.value;
  let ingredients = [];
  addRecipe(url, text, descr, ingredients);
  addRecipeToServer(url, text, descr, ingredients);
  url = '';
  text = '';
  descr = '';

  hideModalHendler();
  event.stopPropagation();
};
form.addEventListener('submit', addRecipeHandler);
