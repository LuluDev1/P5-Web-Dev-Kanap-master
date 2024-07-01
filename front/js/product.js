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
  const imageCont = document.getElementById("item__img");
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

  // Populate colors select options
  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.textContent = color;
    option.value = color;
    colorsSelect.appendChild(option);
  });
}
