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
    // Call createCards after data is fetched
    createCards(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Function that calls the createcard function to create multiple ones
function createCards(products) {
  const items = document.getElementById("items");
  items.innerHTML = "";
  products.forEach((element) => {
    // For each  obj create a card element
    const card = createCard(element);
    items.appendChild(card);
  });
}

// Function to create a single card for a product
function createCard(obj) {
  // Create elements for the card structure
  const link = document.createElement("a");
  const article = document.createElement("article");
  const image = document.createElement("img");
  const name = document.createElement("h3");
  const description = document.createElement("p");

  // Set attributes and text content for each element
  link.setAttribute("href", "./product.html?id=" + obj._id);
  image.setAttribute("src", obj.imageUrl);
  image.setAttribute("alt", obj.altTxt);
  name.textContent = obj.name;
  description.textContent = obj.description;

  // Add classes for styling
  name.classList.add("productName");
  description.classList.add("productDescription");

  // Append elements to build the card structure
  link.appendChild(article);
  article.appendChild(image);
  article.appendChild(name);
  article.appendChild(description);

  return link;
}
