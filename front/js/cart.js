const cartItems = document.getElementById("cart__items");
let totalPrice = 0;
let totalQuantity = 0;

const cartTotal = document.getElementById("totalPrice");
const cartQuantity = document.getElementById("totalQuantity");
const num = localStorage.getItem("num");
const fetchAndCreateCartItems = () => {
  for (let i = 0; i <= num; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));
    console.log(key);
    fetch(`http://localhost:3000/api/products/${item.pageId}`)
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
  cartItem.setAttribute("data-id", item.pageId);
  cartItem.setAttribute("data-color", item.color);

  const cartItemImage = document.createElement("div");
  cartItemImage.classList.add("cart__item__img");
  const cartImage = document.createElement("img");
  cartImage.src = item.imageUrl;
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
    let num = localStorage.getItem("num");
    num--;
    localStorage.setItem("num", num);
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

/**
 * Validates an input element's value against a regular expression and updates the error message element.
 *
 * @param {HTMLInputElement} element - The input element to validate.
 * @param {RegExp} regex - The regular expression to test the input value against.
 * @param {HTMLElement} errorMsgElement - The element where the error message will be displayed.
 * @param {string} errorMsg - The error message to display if validation fails.
 * @returns {boolean} - Returns true if the input value is valid, otherwise false.
 */
function validateInput(element, regex, errorMsgElement, errorMsg) {
  const value = element.value.trim();
  if (regex.test(value)) {
    errorMsgElement.textContent = "";
    return true;
  } else {
    errorMsgElement.textContent = errorMsg;
    return false;
  }
}

// Validation rules
const validationRules = [
  {
    element: document.getElementById("firstName"),
    regex: /^[a-z ,.'-]+$/i,
    errorMsgElement: document.getElementById("firstNameErrorMsg"),
    errorMsg: "Please input a correct first name.",
  },
  {
    element: document.getElementById("lastName"),
    regex: /^[a-z ,.'-]+$/i,
    errorMsgElement: document.getElementById("lastNameErrorMsg"),
    errorMsg: "Please input a correct last name.",
  },
  {
    element: document.getElementById("address"),
    regex: /^[a-zA-Z0-9\s,.'\-#]+$/,
    errorMsgElement: document.getElementById("addressErrorMsg"),
    errorMsg: "Please enter a valid address.",
  },
  {
    element: document.getElementById("city"),
    regex: /^[a-zA-Z\s.'\-]+$/,
    errorMsgElement: document.getElementById("cityErrorMsg"),
    errorMsg: "Please enter a valid city name.",
  },
  {
    element: document.getElementById("email"),
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    errorMsgElement: document.getElementById("emailErrorMsg"),
    errorMsg: "Please enter a valid email address.",
  },
];

// Attach event listeners for live validation
validationRules.forEach((rule) => {
  rule.element.addEventListener("input", () => {
    validateInput(
      rule.element,
      rule.regex,
      rule.errorMsgElement,
      rule.errorMsg
    );
  });
});

// Validate entire form
function validateForm() {
  return validationRules.every((rule) =>
    validateInput(rule.element, rule.regex, rule.errorMsgElement, rule.errorMsg)
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
      products.push(item.pageId);
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
