const urlLink = "https://api.mercadolibre.com/sites/MLB/search?q=computador"
const urlProductId = "https://api.mercadolibre.com/items/"
const total = 0;

async function fetchProductId(newUrlId) {
  if (newUrlId) {
    const response = await fetch(newUrlId);
    const object = await response.json();
    document.querySelector('.cart__items').appendChild(createCartItemElement(handleProductCartInfo(object)));
    document.querySelector('.total-price').innerText = sumCartItem(object);
    handleLocalStorage();
  }
}

function localStorageSave() {
  const cartItem = document.querySelector('.cart__items');
  localStorage.setItem('items', cartItem.innerHTML);
};

function LoadLocalStorage() {
  if (localStorage.length > 0) {
    const cartList = document.querySelector('.cart__items');
    cartList.addEventListener('click', cartItemClickListener);
    cartList.innerHTML = localStorage.getItem('cartItens');
    const fullPrice = document.querySelector('.total-price');
    fullPrice.innerText = localStorage.getItem('price');
  }
}

function clearShoppingCart() {
  document.querySelector('.cart__items').innerHTML = '';
  total = 0;
  document.querySelector('.total-price').innerText = total;
}

function addOnClickEventClear() {
  const clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', clearShoppingCart);
}

function sumCartItem(item) {
  total = parseFloat(document.querySelector('.total-price').innerText, 10);
  total += item.price;
  return total;
}

function handleLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  const totalPrice = document.querySelector('.total-price').innerText;
  localStorage.clear();
  localStorage.setItem('cartItens', cartItems);
  localStorage.setItem('price', totalPrice);
}

function getProductId() {
  const productSection = document.querySelector('.items');
  productSection.addEventListener('click', function (event) {
    if (event.target.className === 'item__add') {
      const endpoint = event.target.parentNode.firstChild.innerText;
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
  const productInfo = {
    sku: product.id,
    name: product.title,
    image: product.thumbnail,
  };
  return productInfo;
}

function handleProductCartInfo(product) {
  const productInfo = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  };
  return productInfo;
}

function startLoad() {
  const title = document.createElement('h1');
  title.innerText = 'Loading...';
  title.className = 'loading';
  document.querySelector('.items').appendChild(title);
}

function removeLoad() {
  const loading = document.querySelector('.loading');
  document.querySelector('.items').removeChild(loading);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
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
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function subProductItem(product) {
  const sum = parseFloat(document.querySelector('.total-price').innerText, 10);
  const productPrice = parseFloat(product.innerText.split('$')[1], 10);
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


