const cartItems = document.getElementById("cart__items");
let totalPrice = 0;
let totalQuantity = 0;

const cartTotal = document.getElementById("totalPrice");
const cartQuantity = document.getElementById("totalQuantity");

const fetchAndCreateCartItems = () => {
  for (let i = 1; i < localStorage.length; i++) {
    const key = localStorage.key(i).toString();
    const item = JSON.parse(localStorage.getItem(key));

    fetch("http://localhost:3000/api/products/" + item.page_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        createCartItem(item, data.price, key);
        totalPrice += data.price * item.quantity;
        totalQuantity += item.quantity;
        updateTotalPriceAndQuantity();
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }
};

function createCartItem(item, price, key) {
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", item.page_id);
  cartItem.setAttribute("data-color", item.color);

  const cartItemImage = document.createElement("div");
  cartItemImage.classList.add("cart__item__img");
  const cartImage = document.createElement("img");
  cartImage.src = item.imageURL;
  cartItemImage.appendChild(cartImage);
  cartItem.appendChild(cartItemImage);

  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");
  cartItem.appendChild(cartItemContent);

  const cartItemDesc = document.createElement("div");
  cartItemDesc.classList.add("cart__item__content__description");
  cartItemContent.appendChild(cartItemDesc);

  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  cartItemDesc.appendChild(h2);

  const color = document.createElement("p");
  color.textContent = item.color;
  cartItemDesc.appendChild(color);

  const priceElement = document.createElement("p");
  priceElement.textContent = "€" + price;
  cartItemDesc.appendChild(priceElement);

  const cartItemSettings = document.createElement("div");
  cartItemSettings.classList.add("cart__item__content__settings");
  cartItemContent.appendChild(cartItemSettings);

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

  const deleteButton = document.createElement("div");
  deleteButton.classList.add("cart__item__content__settings__delete");
  const deleteBtn = document.createElement("p");
  deleteBtn.classList.add("deleteItem");
  deleteBtn.textContent = "Delete";
  deleteButton.appendChild(deleteBtn);
  cartItemSettings.appendChild(deleteButton);

  deleteBtn.addEventListener("click", () => {
    localStorage.removeItem(key);
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
      localStorage.setItem(key, JSON.stringify(item));
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

const updateTotalPriceAndQuantity = () => {
  cartTotal.textContent = totalPrice;
  cartQuantity.textContent = totalQuantity;
};

fetchAndCreateCartItems();

// Define global variables for the form input elements
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

// Validation functions with live error warnings
function validateFirstName() {
  const regName = /^[a-z ,.'-]+$/i;
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");

  const firstName = firstNameInput.value.trim();
  if (firstName.length > 0 && regName.test(firstName)) {
    firstNameErrorMsg.textContent = "";
    return true;
  } else {
    firstNameErrorMsg.textContent = "Please input a correct first name.";
    return false;
  }
}

function validateLastName() {
  const regName = /^[a-z ,.'-]+$/i;
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");

  const lastName = lastNameInput.value.trim();
  if (regName.test(lastName)) {
    lastNameErrorMsg.textContent = "";
    return true;
  } else {
    lastNameErrorMsg.textContent = "Please input a correct last name.";
    return false;
  }
}

function validateAddress() {
  const regAddress = /^[a-zA-Z0-9\s,.'\-#]+$/;
  const addressErrorMsg = document.getElementById("addressErrorMsg");

  const address = addressInput.value.trim();
  if (regAddress.test(address)) {
    addressErrorMsg.textContent = "";
    return true;
  } else {
    addressErrorMsg.textContent = "Please enter a valid address.";
    return false;
  }
}

function validateCity() {
  const regCity = /^[a-zA-Z\s.'\-]+$/;
  const cityErrorMsg = document.getElementById("cityErrorMsg");

  const city = cityInput.value.trim();
  if (regCity.test(city)) {
    cityErrorMsg.textContent = "";
    return true;
  } else {
    cityErrorMsg.textContent = "Please enter a valid city name.";
    return false;
  }
}

function validateEmail() {
  const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailErrorMsg = document.getElementById("emailErrorMsg");

  const email = emailInput.value.trim();
  if (regEmail.test(email)) {
    emailErrorMsg.textContent = "";
    return true;
  } else {
    emailErrorMsg.textContent = "Please enter a valid email address.";
    return false;
  }
}

// Function to check all validations
function validateForm() {
  return (
    validateFirstName() &&
    validateLastName() &&
    validateAddress() &&
    validateCity() &&
    validateEmail()
  );
}

// Call validation functions to enable live error warnings on input change
firstNameInput.addEventListener("input", validateFirstName);
lastNameInput.addEventListener("input", validateLastName);
addressInput.addEventListener("input", validateAddress);
cityInput.addEventListener("input", validateCity);
emailInput.addEventListener("input", validateEmail);

// Define form
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (localStorage.length === 0) {
    alert("Your cart is empty. Please add items before placing an order.");
    return;
  }
  if (validateForm()) {
    const products = [];
    for (let i = 1; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const item = JSON.parse(localStorage.getItem(key));
      products.push(item.page_id);
    }

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          firstName: firstNameInput.value,
          lastName: lastNameInput.value,
          address: addressInput.value,
          city: cityInput.value,
          email: emailInput.value,
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
        let orderId = json.orderId;

        window.location.href = "confirmation.html" + "?orderId=" + orderId;
        localStorage.clear();
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Error placing order. Please try again later.");
      });
  } else {
    console.log("Form validation failed. Please check errors.");
    alert("Please fill out all required fields correctly.");
  }
});
