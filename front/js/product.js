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
    // UPdate the product page only when the promise completes
    product = data;
    updatePage();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Update the product page with fetched product data
function updatePage() {
  // The title of the page
  const title = document.getElementById("title");
  title.textContent = product.name;

  // Product image
  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.altText;
  document.querySelector(".item__img").innerHTML = "";
  document.querySelector(".item__img").appendChild(image);

  // Product price and description
  document.getElementById("price").textContent = product.price;
  document.getElementById("description").textContent = product.description;

  // Color input field
  const colorsSelect = document.getElementById("colors");
  colorsSelect.innerHTML = "";

  // Create a color option for every product color option
  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.textContent = color;
    option.value = color;
    colorsSelect.appendChild(option);
  });
}

// Get the add to cart element
document.getElementById("addToCart").addEventListener("click", addToCart);

function addToCart() {
  const color = document.getElementById("colors").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (quantity < 1) {
    alert("Quantity must be 1 or greater to add to cart.");
    return;
  }

  const CART_KEY = "cartItems";
  const NUM_KEY = "num";

  let num = parseInt(window.localStorage.getItem(NUM_KEY)) || 0;
  let cartItems = JSON.parse(window.localStorage.getItem(CART_KEY)) || [];

  let found = false;

  cartItems = cartItems.map((item) => {
    if (item.page_id === page_id && item.color === color) {
      item.quantity += quantity;
      found = true;
    }
    return item;
  });

  if (!found) {
    const newItem = {
      num: num,
      quantity: quantity,
      color: color,
      page_id: page_id,
      imageURL: product.imageUrl,
      name: product.name,
      altText: product.altText,
      description: product.description,
    };

    cartItems.push(newItem);
    num++;
    window.localStorage.setItem(NUM_KEY, num);
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  alert("Added to cart");
}
