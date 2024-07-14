const cartItems = document.getElementById("cart__items");
const cartTotal = document.getElementById("totalPrice");
const cartQuantity = document.getElementById("totalQuantity");

let totalPrice = 0;
let totalQuantity = 0;

/**
 * Fetch each product and create card element
 */
const fetchAndCreateCartItems = () => {
  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemsData.forEach((item, index) => {
    fetch(`http://localhost:3000/api/products/${item.page_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        createCartItem(item, data.price, index);
        totalPrice += data.price * item.quantity;
        totalQuantity += item.quantity;
        updateTotalPriceAndQuantity();
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  });
};

/**
 * Create cart item cards
 *
 * @param {object} item - cart item
 * @param {number} price - cart item price
 * @param {number} index - localStorage key index
 */
function createCartItem(item, price, index) {
  // Article element
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", item.page_id);
  cartItem.setAttribute("data-color", item.color);

  // Image element
  const cartItemImage = document.createElement("div");
  cartItemImage.classList.add("cart__item__img");
  const cartImage = document.createElement("img");
  cartImage.src = item.imageURL;
  cartItemImage.appendChild(cartImage);
  cartItem.appendChild(cartItemImage);

  // Content element
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");
  cartItem.appendChild(cartItemContent);

  // Description element
  const cartItemDesc = document.createElement("div");
  cartItemDesc.classList.add("cart__item__content__description");
  cartItemContent.appendChild(cartItemDesc);

  // Title element
  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  cartItemDesc.appendChild(h2);

  // Color element
  const color = document.createElement("p");
  color.textContent = item.color;
  cartItemDesc.appendChild(color);

  // Price element
  const priceElement = document.createElement("p");
  priceElement.textContent = "€" + price;
  cartItemDesc.appendChild(priceElement);

  // Cart settings
  const cartItemSettings = document.createElement("div");
  cartItemSettings.classList.add("cart__item__content__settings");
  cartItemContent.appendChild(cartItemSettings);

  // Quantity
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

  // Delete
  const deleteButton = document.createElement("div");
  deleteButton.classList.add("cart__item__content__settings__delete");
  const deleteBtn = document.createElement("p");
  deleteBtn.classList.add("deleteItem");
  deleteBtn.textContent = "Delete";
  deleteButton.appendChild(deleteBtn);
  cartItemSettings.appendChild(deleteButton);

  // Update num if item removed
  deleteBtn.addEventListener("click", () => {
    const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItemsData.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
    cartItems.removeChild(cartItem);
    totalPrice -= price * item.quantity;
    totalQuantity -= item.quantity;
    updateTotalPriceAndQuantity();
  });

  quantityInput.addEventListener("change", (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity >= 1 && newQuantity <= 100) {
      totalPrice -= price * item.quantity;
      totalQuantity -= item.quantity;
      item.quantity = newQuantity;
      const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
      cartItemsData[index] = item;
      localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
      totalPrice += price * item.quantity;
      totalQuantity += item.quantity;
      updateTotalPriceAndQuantity();
    } else {
      event.target.value = item.quantity;
      alert("Quantity must be between 1 and 100.");
    }
  });

  cartItems.appendChild(cartItem);
}

/**
 * Update the price and quantity on the page
 */
const updateTotalPriceAndQuantity = () => {
  cartTotal.textContent = totalPrice;
  cartQuantity.textContent = totalQuantity;
};

fetchAndCreateCartItems();

/**
 * And array with all the input ids regex and error msg
 */
const inputs = [
  {
    id: "firstName",
    regex: /^[a-z ,.'-]+$/i,
    errorMsg: "Please input a correct first name.",
  },
  {
    id: "lastName",
    regex: /^[a-z ,.'-]+$/i,
    errorMsg: "Please input a correct last name.",
  },
  {
    id: "address",
    regex: /^[a-zA-Z0-9\s,.'\-#]+$/,
    errorMsg: "Please enter a valid address.",
  },
  {
    id: "city",
    regex: /^[a-zA-Z\s.'\-]+$/,
    errorMsg: "Please enter a valid city name.",
  },
  {
    id: "email",
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    errorMsg: "Please enter a valid email address.",
  },
];

/**
 * Validate a single input field
 * @param {object} input - The input field object
 * @returns {boolean} - True if the input is valid, otherwise false
 */
function validateInput(input) {
  const value = document.getElementById(input.id).value.trim();
  const isValid = input.regex.test(value);
  const errorMsgElement = document.getElementById(`${input.id}ErrorMsg`);
  errorMsgElement.textContent = isValid ? "" : input.errorMsg;
  return isValid;
}

/**
 * Validate all form inputs
 * @returns {boolean} - True if all inputs are valid, otherwise false
 */
function validateForm() {
  return inputs.every(validateInput);
}

// Add input event listeners
inputs.forEach((input) => {
  document
    .getElementById(input.id)
    .addEventListener("input", () => validateInput(input));
});

// Form event listener
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const cartItemsData = JSON.parse(localStorage.getItem("cartitems")) || [];

  if (parseInt(localStorage.getItem("num")) === 0) {
    alert("Your cart is empty. Please add items before placing an order.");
    return;
  }

  if (validateForm()) {
    const products = cartItemsData.map((item) => item.page_id);

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        },
        products,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to place order");
        }
        return response.json();
      })
      .then((json) => {
        console.log("Order placed successfully");
        localStorage.setItem("customerOrder", JSON.stringify(json));
        const orderId = json.orderId;
        window.location.href = `confirmation.html?orderId=${orderId}`;
        localStorage.clear();
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Error placing order. Please try again later.");
      });
  } else {
    alert("Please fill out all required fields correctly.");
  }
});
