const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pageId = urlParams.get("id");

const apiUrl = `http://localhost:3000/api/products/${pageId}`;

let product;

// Fetch data from the API endpoint
fetch(apiUrl)
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
    console.error("Error fetching product data:", error);
  });

/**
 * Updates the product page with details of the fetched product.
 */
function updatePage() {
  // Title of the product page
  const title = document.getElementById("title");
  title.textContent = product.name;

  // Product image
  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.altText;
  const itemImg = document.querySelector(".item__img");
  itemImg.innerHTML = ""; // Clear previous content
  itemImg.appendChild(image);

  // Product price and description
  document.getElementById("price").textContent = product.price;
  document.getElementById("description").textContent = product.description;

  // Color options select
  const colorsSelect = document.getElementById("colors");
  colorsSelect.innerHTML = "";

  // Create color options based on product colors
  product.colors.forEach((color) => {
    const option = new Option(color, color);
    colorsSelect.appendChild(option);
  });
}

// Add to cart button event listener
document.getElementById("addToCart").addEventListener("click", addToCart);

/**
 * Adds the selected product to the shopping cart stored in localStorage.
 */
function addToCart() {
  const color = document.getElementById("colors").value;
  const quantity = parseInt(document.getElementById("quantity").value) || 1;

  let num = parseInt(localStorage.getItem("num")) || 0;
  let found = false;

  // Iterate through localStorage items to find matching product
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === "num") continue;

    try {
      const item = JSON.parse(localStorage.getItem(key));

      // Update quantity if product and color match
      if (item.pageId === pageId && item.color === color) {
        item.quantity += quantity;
        localStorage.setItem(key, JSON.stringify(item));
        console.log("Updated item:", item);
        found = true;
        break;
      }
    } catch (error) {
      console.error("Error parsing item from localStorage:", error);
    }
  }

  // If product not found in cart, add as new item
  if (!found) {
    const newItem = {
      num: num,
      quantity: quantity,
      color: color,
      pageId: pageId,
      imageUrl: product.imageUrl,
      name: product.name,
      altText: product.altText,
      description: product.description,
    };

    localStorage.setItem(num.toString(), JSON.stringify(newItem));
    console.log("Added new item:", newItem);
    num++;
    localStorage.setItem("num", num.toString());
  }

  // Debug: Log entire localStorage
  console.log("LocalStorage after addToCart:", localStorage);
}
