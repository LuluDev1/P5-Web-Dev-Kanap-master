const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page_id = urlParams.get("id");

const url = "http://localhost:3000/api/products/" + page_id;

let product;

// Fetch data from the API endpoint
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    product = data;
    updatePage();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function updatePage() {
  const title = document.getElementById("title");
  title.textContent = product.name;
  const imageCont = document.querySelector(".item__img");
  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.altText;
  imageCont.innerHTML = "";
  imageCont.appendChild(image);

  const price = document.getElementById("price");
  price.textContent = product.price;
  const description = document.getElementById("description");
  description.textContent = product.description;

  const colorsSelect = document.getElementById("colors");

  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.textContent = color;
    option.value = color;
    colorsSelect.appendChild(option);
  });
}

document.getElementById("addToCart").addEventListener("click", addToCart);

function addToCart() {
  // Retrieve the current value of 'num' from localStorage
  var num = window.localStorage.getItem("num") || 0;

  // Store the 'page_id' in localStorage with the key incremented value of 'num'
  localStorage.setItem(num, page_id);

  // Increment 'num' for the next item
  num++;

  // Store the updated 'num' back into localStorage
  localStorage.setItem("num", num);
  const cart = [1, 2, 3, 4, 5, 6, 7];
  const cartString = JSON.stringify(cart);
  console.log(cartString);
  localStorage.setItem("cart", cartString);
  const myCart = localStorage.getItem("cart");

  console.log(JSON.parse(myCart));
}
