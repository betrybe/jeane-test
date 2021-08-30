let urlLink = "https://api.mercadolibre.com/sites/MLB/search?q=computador"
let urlProductId = "https://api.mercadolibre.com/items/"
let total = 0;

async function fetchProductId(newUrlId) {
  if (newUrlId) {
    let response = await fetch(newUrlId);
    let object = await response.json();
    document.querySelector('.cart__items').appendChild(createCartItemElement(handleProductCartInfo(object)));
    document.querySelector('.total-price').innerText = sumCartItem(object);
    handleLocalStorage();
  }
}

function localStorageSave() {
  let cartItem = document.querySelector('.cart__items');
  localStorage.setItem('items', cartItem.innerHTML);
};

function LoadLocalStorage() {
  if (localStorage.length > 0) {
    let cartList = document.querySelector('.cart__items');
    cartList.addEventListener('click', cartItemClickListener);
    cartList.innerHTML = localStorage.getItem('cartItens');
    let fullPrice = document.querySelector('.total-price');
    fullPrice.innerText = localStorage.getItem('price');
  }
}

function clearShoppingCart() {
  document.querySelector('.cart__items').innerHTML = '';
  total = 0;
  document.querySelector('.total-price').innerText = total;
}

function addOnClickEventClear() {
  let clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', clearShoppingCart);
}

function sumCartItem(item) {
  total = parseFloat(document.querySelector('.total-price').innerText, 10);
  total += item.price;
  return total;
}

function handleLocalStorage() {
  let cartItems = document.querySelector('.cart__items').innerHTML;
  let totalPrice = document.querySelector('.total-price').innerText;
  localStorage.clear();
  localStorage.setItem('cartItens', cartItems);
  localStorage.setItem('price', totalPrice);
}

function getProductId() {
  let productSection = document.querySelector('.items');
  productSection.addEventListener('click', function (event) {
    if (event.target.className === 'item__add') {
      let endpoint = event.target.parentNode.firstChild.innerText;
      urlProductId = `${urlProductId}${endpoint}`;
      fetchProductId(urlProductId);
      urlProductId = 'https://api.mercadolibre.com/items/';
    }
  });
}

function fetchApiMercadoLivre() {
  fetch(urlLink)
    .then((response) => response.json())
    .then((object) => {
      removeLoad();
      object.results.forEach((computer) => {
        document.querySelector(".items")
          .appendChild(createProductItemElement(handleProductInfo(computer)))
      })
    }).catch((error) => console.log(error))
}

function handleProductInfo(product) {
  let productInfo = {
    sku: product.id,
    name: product.title,
    image: product.thumbnail,
  };
  return productInfo;
}

function handleProductCartInfo(product) {
  let productInfo = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  };
  return productInfo;
}

function startLoad() {
  let title = document.createElement('h1');
  title.innerText = 'Loading...';
  title.className = 'loading';
  document.querySelector('.items').appendChild(title);
}

function removeLoad() {
  let loading = document.querySelector('.loading');
  document.querySelector('.items').removeChild(loading);
}

function createProductImageElement(imageSource) {
  let img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  let e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  let section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  handleLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  let li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function subProductItem(product) {
  let sum = parseFloat(document.querySelector('.total-price').innerText, 10);
  let productPrice = parseFloat(product.innerText.split('$')[1], 10);
  sum -= productPrice;
  return sum;
}

function subItemTotalPrice() {
  document.querySelector('.cart__items').addEventListener('click', function (event) {
    document.querySelector('.total-price').innerText = subProductItem(event.target);
    handleLocalStorage();
  });
}

window.onload = () => {
  startLoad();
  fetchApiMercadoLivre();
  getProductId();
  LoadLocalStorage();
  addOnClickEventClear();
  fetchProductId();
  subItemTotalPrice();
};

