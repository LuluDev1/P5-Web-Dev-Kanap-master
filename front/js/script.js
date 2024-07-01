const url = "http://localhost:3000/api/products";
let products = []; // Initialize products as an empty array

// Fetch data from the API endpoint
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    products = data; 
    createCards(products); // Call createCards after data is fetched
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Function to create cards for each product
function createCards(array) {
  const items = document.getElementById("items");
  items.innerHTML = "";
  array.forEach((element) => {
    const card = createCard(element); 
    items.appendChild(card); // Append each card to the items container
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
