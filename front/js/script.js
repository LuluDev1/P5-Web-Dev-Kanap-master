const url = "http://localhost:3000/api/products";

// Fetch data from the API endpoint
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    createCards(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

/**
 * Create cards for each product in the provided data JSON array
 * @param {Array} products - JSON Array of product objects
 */
const createCards = (products) => {
  const items = document.getElementById("items");
  items.textContent = ""; // Clear previous content

  products.forEach((product) => {
    const card = createCard(product);
    items.appendChild(card);
  });
};

/**
 * Create a single card element for a product
 * @param {Object} product - Product object containing details
 * @returns {HTMLElement} - Link element representing the product card
 */
const createCard = (product) => {
  const link = document.createElement("a");
  link.setAttribute("href", `./product.html?id=${product._id}`);

  const article = document.createElement("article");

  const image = document.createElement("img");
  image.setAttribute("src", product.imageUrl);
  image.setAttribute("alt", product.altTxt);

  const name = document.createElement("h3");
  name.textContent = product.name;
  name.classList.add("productName");

  const description = document.createElement("p");
  description.textContent = product.description;
  description.classList.add("productDescription");

  // Append elements to build the card structure
  article.appendChild(image);
  article.appendChild(name);
  article.appendChild(description);

  link.appendChild(article);

  return link;
};
