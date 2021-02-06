'use strict';



const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurans = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clear = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');

const cart = [];

const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${url}, status ${response.status}`)
  }
  return await response.json();
};



function toggleModal() {
  modal.classList.toggle("is-open");
}

function toogleModalAuth() {
  modalAuth.classList.toggle('is-open');
}



function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut) //-

    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}



function notAuthorized() {
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    localStorage.setItem('gloDelivery', login);
    console.log(login);
    toogleModalAuth();
    buttonAuth.removeEventListener('click', toogleModalAuth);
    closeAuth.removeEventListener('click', toogleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
  }
  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}



function createCardRestaurant(restaurant) {

  const {
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery
  } = restaurant;
  const cardsRestaurant=document.createElement('a');
  cardsRestaurant.className='card card-restaurant';
  cardsRestaurant.products=products; 
  
  const card = `
 <img src="${image}" alt="image" class="card-image"/>
<div class="card-text">
  <div class="card-heading">
    <h3 class="card-title">${name}</h3> 
  </div> 
  <div class="card-info">
    <div class="rating">
      ${stars}
    </div>
    <div class="price">Від ${price} грн</div>
    <div class="category">${kitchen}</div>
  </div> 
</div> 
</a>
`;
cardsRestaurant.insertAdjacentHTML("beforeend", card)
  cardsRestaurans.insertAdjacentElement("beforeend", cardsRestaurant);
}



function createCardGood({
  description,
  id,
  image,
  name,
  price
}) {
  //card.id=id;
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML("beforeend", `
   
						<img src=${image} alt=${name} class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div> 
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div> 
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} грн</strong>
							</div>
						</div> 
				 
  `);
  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  const restaurant = target.closest('.card-restaurant');
  console.log(restaurant);
  if (restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    getData(`./db/${restaurant.products}`).then(function (data) {
      data.forEach(createCardGood)
    });

  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    // const cost = card.querySelector('.card-price').textContent;

    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    })
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        count: 1,
      })
    }
    //cost

    console.log(cart);
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function ({
    id,
    title,
    count
  }) {
    const itemCart = `
   <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">250 ₽</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
   `;
    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + 1; //(parseFloat(item.cost))*item.count;
  }, 0);
  //modalPrice.textContent=modalPrice;
}

function changeCount() {
  const target = event.target;
  //counter-button
  if (target / classList.contains('counter-minus')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    food.count--;
    renderCart();
  }
  if (target / classList.contains('counter-plus')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    food.count++;
    renderCart();
  }
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant)
  });


  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();

  });

  clear.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  })

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart)

  close.addEventListener("click", toggleModal);

  cardsRestaurans.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })



  checkAuth();
}

init();
 