const cartItems = document.getElementById("cart__items");
const url = "http://localhost:3000/api/products/";

// Use async function to handle asynchronous fetch calls
async function fetchAndCreateCartItems() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));

    try {
      // Fetch product details based on item.page_id
      const response = await fetch(url + item.page_id);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();

      // Create cart item with fetched price
      createCartItem(item, data.price);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }
}

function createCartItem(item, price) {
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", item.page_id);
  cartItem.setAttribute("data-color", item.color);

  // Create and append image container
  const cartItemImage = document.createElement("div");
  cartItemImage.classList.add("cart__item__img");
  const cartImage = document.createElement("img");
  cartImage.src = item.imageURL;
  cartItemImage.appendChild(cartImage);
  cartItem.appendChild(cartItemImage);

  // Create and append content container
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");
  cartItem.appendChild(cartItemContent);

  // Create and append description section
  const cartItemDesc = document.createElement("div");
  cartItemDesc.classList.add("cart__item__content__description");
  cartItemContent.appendChild(cartItemDesc);

  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  cartItemDesc.appendChild(h2);

  const color = document.createElement("p");
  color.textContent = item.color; // Assuming you want to display color here
  cartItemDesc.appendChild(color);

  const priceElement = document.createElement("p");
  priceElement.textContent = "€" + price; // Use the fetched price
  cartItemDesc.appendChild(priceElement);

  // Create and append settings section
  const cartItemSettings = document.createElement("div");
  cartItemSettings.classList.add("cart__item__content__settings");
  cartItemContent.appendChild(cartItemSettings);

  // Quantity section
  const cartItemQuantity = document.createElement("div");
  cartItemQuantity.classList.add("cart__item__content__settings__quantity");
  cartItemSettings.appendChild(cartItemQuantity);

  const quantityLabel = document.createElement("p");
  quantityLabel.textContent = "Quantity:";
  cartItemQuantity.appendChild(quantityLabel);

  const quantityInput = document.createElement("input");
  quantityInput.classList.add("itemQuantity");
  quantityInput.type = "number";
  quantityInput.name = "itemQuantity";
  quantityInput.value = item.quantity;
  quantityInput.min = "1";
  quantityInput.max = "100";
  cartItemQuantity.appendChild(quantityInput);

  // Delete button
  const deleteButton = document.createElement("div");
  deleteButton.classList.add("cart__item__content__settings__delete");
  const deleteBtn = document.createElement("p");
  deleteBtn.classList.add("deleteItem");
  deleteBtn.textContent = "Delete";
  deleteButton.appendChild(deleteBtn);
  cartItemSettings.appendChild(deleteButton);

  // Add event listener to delete button
  deleteBtn.addEventListener("click", () => {
    // Remove the cart item from localStorage
    localStorage.removeItem("item_" + item.num);

    // Remove the cart item from the DOM
    cartItems.removeChild(cartItem);
  });

  // Event listener for quantity change
  quantityInput.addEventListener("change", (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity >= 1 && newQuantity <= 100) {
      // Update item quantity in localStorage
      item.quantity = newQuantity;
      localStorage.setItem("item_" + item.num, JSON.stringify(item));
    } else {
      // Reset input value if out of range
      event.target.value = item.quantity;
      alert("Quantity must be between 1 and 100.");
    }
  });

  // Append cart item to cartItems container
  cartItems.appendChild(cartItem);
}

// Call the async function to fetch and create cart items
fetchAndCreateCartItems();
