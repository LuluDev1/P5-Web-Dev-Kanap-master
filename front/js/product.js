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
  // Get color and quantity from form inputs
  const color = document.getElementById("colors").value;
  const quantity = parseInt(document.getElementById("quantity").value) || 1;

  // Initialize num from localStorage or default to 0
  let num = parseInt(window.localStorage.getItem("num")) || 0;

  let found = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("item_")) {
      const item = JSON.parse(localStorage.getItem(key));
      if (item.page_id === page_id && item.color === color) {
        item.quantity += quantity;
        localStorage.setItem(key, JSON.stringify(item));
        found = true;
        break;
      }
    }
  }

  // If item doesn't exist, add it to localStorage
  if (!found) {
    localStorage.setItem(
      "item_" + num,
      JSON.stringify({
        num: num,
        quantity: quantity,
        color: color,
        page_id: page_id,
        imageURL: product.imageUrl,
        name: product.name,
        altText: product.altTxt,
        description: product.description,
      })
    );
    num++; // Increment num for the next item
    window.localStorage.setItem("num", num); // Store updated num in localStorage
  }
}
