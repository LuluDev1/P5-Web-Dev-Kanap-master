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
  // Get color and quantity from form inputs
  const color = document.getElementById("colors").value;
  const quantity = parseInt(document.getElementById("quantity").value) || 1;

  // Initialize num from localStorage or default to 0
  let num = parseInt(window.localStorage.getItem("num")) || 0;

  // Boolean value for if the same item in the cart exists
  let found = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Skip the "num" key to avoid processing it as an item
    if (key === "num") continue;

    try {
      const item = JSON.parse(localStorage.getItem(key));

      // Check if item matches the current product and color
      if (item.page_id === page_id && item.color === color) {
        item.quantity += quantity;
        localStorage.setItem(key, JSON.stringify(item)); // Update item with new quantity using the same key
        found = true;
        break;
      }
    } catch (error) {
      console.error("Error parsing item from localStorage:", error);
    }
  }

  // If item doesn't exist, add it to localStorage/Cart
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
    localStorage.setItem(num.toString(), JSON.stringify(newItem));
    num++; // Increment num for the next item
    window.localStorage.setItem("num", num); // Store updated num in localStorage
  }
}
