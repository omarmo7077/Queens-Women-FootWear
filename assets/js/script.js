"use strict";

/**
 * navbar toggle
 */

// Function to fetch products from Firebase Realtime Database
/// Global variables to keep track of current page and products per page
let currentPage = 1;
const itemsPerPage = 30;
let totalProducts = 0;
let allProducts = [];
let allData = {};

function fetchAndRenderProducts() {
  fetch("https://queen-s-footwear-default-rtdb.firebaseio.com/Products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Check if data is not empty
      if (data) {
        allData = data;
        allProducts = Object.keys(data).reverse(); // Reverse the product keys to sort from end to first
        totalProducts = allProducts.length;
        renderProducts(); // Call renderProducts here after setting allData and allProducts
      } else {
        console.log("No products found");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function renderProducts() {
  const productList = document.querySelector(".product-list");
  productList.innerHTML = ""; // Clear existing products from the list

  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalProducts);
  const productKeys = allProducts.slice(start, end);

  // Iterate through the product data and render each product
  productKeys.forEach((key) => {
    const product = allData[key];
    const productCard = document.createElement("li");
    productCard.classList.add("product-item");

    // Get colors for all sizes if sizes property exists
    const allColors = new Set();
    const colorValues = {};
    if (product.sizes) {
      Object.values(product.sizes).forEach((sizeDetails) => {
        if (sizeDetails) {
          // Ensure sizeDetails is not null or undefined
          Object.keys(sizeDetails).forEach((color) => {
            allColors.add(color);
            colorValues[color] = sizeDetails[color]["color-value"];
          });
        }
      });
    }

    // Construct color options HTML
    let colorOptionsHTML = "";
    const colorsArray = Array.from(allColors);
    const displayColors = colorsArray.slice(0, 3);

    displayColors.forEach((color) => {
      const colorValue = colorValues[color] || "#000000"; // Default color if not found
      colorOptionsHTML += `<div class="color-option2 " style="background-color: ${colorValue};" data-color-name="${color}"></div>`;
    });

    if (colorsArray.length > 3) {
      colorOptionsHTML += `<div class="color-option2 flex center align-items font-small" style="background-color: #e2e2e2;" data-color-name="more">+${
        allColors.size - 3
      }</div>`;
    }

    // If no colors are available, show a default message or hide the color options
    const colorOptionsContainer =
      allColors.size > 0
        ? `<div class="color-options m-5 mb-7 center">${colorOptionsHTML}</div>`
        : `<p class="no-color-options mb-7">No color options available</p>`;

    // Construct product card HTML
    productCard.innerHTML = `
      <div class="product-card" tabindex="0">
        <figure class="card-banner" id="cardBanner">
          <img src="${product["product-photo"]}" width="312" height="350" alt="${product["product-title"]}" class="image-contain" id="swipe1">
          <img src="${product["product-photo2"]}" width="312" height="350" id="swipe2" class="image-contain" style="display: none;">
          <ul class="card-action-list">
            <li class="card-action-item">
              <button class="card-action-btn add-to-cart-btn" data-product-id="${key}" aria-labelledby="card-label-1">
                <ion-icon name="cart-outline" role="img" class="md hydrated" aria-label="cart outline"></ion-icon>
              </button>
              <div class="card-action-tooltip" id="card-label-1">Add to Cart</div>
            </li>
            <li class="card-action-item" onclick="productDetails('${key}')">
              <button class="card-action-btn" aria-labelledby="card-label-3">
                <ion-icon name="eye-outline" role="img" class="md hydrated" aria-label="eye outline"></ion-icon>
              </button>
              <div class="card-action-tooltip" id="card-label-3">Quick View</div>
            </li>
          </ul>
        </figure>
        <div class="card-content">
          ${colorOptionsContainer}
          <h3 class="h3 card-title mb-7" onclick="productDetails('${key}')">
            <a class="title" href="#">${product["product-title"]}</a>
          </h3>
          <p class="card-price">${product["Product-Price"]} EGP</p>
          <a href="#" class="card-price hidden font-small">${key}</a>
        </div>
      </div>`;

    // Append product card to the product list
    productList.appendChild(productCard);

    // Set up hover effect for the newly created product card
    setupHoverEffect(productCard);
  });

  updatePaginationButtons();

  // Set up event listeners for "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) =>
    button.addEventListener("click", (event) => {
      const productId =
        event.target.closest(".add-to-cart-btn").dataset.productId;
      openCartModal(productId);
    })
  );
}

function updatePaginationButtons() {
  document.getElementById("prevPageBtn").disabled = currentPage === 1;
  document.getElementById("nextPageBtn").disabled =
    currentPage * itemsPerPage >= totalProducts;
}

// Function to set up hover effect
function setupHoverEffect(productCard) {
  const swipe1 = productCard.querySelector("#swipe1");
  const swipe2 = productCard.querySelector("#swipe2");

  productCard.addEventListener("mouseenter", () => {
    swipe1.style.display = "none";
    swipe2.style.display = "block";
  });
  productCard.addEventListener("mouseleave", () => {
    swipe1.style.display = "block";
    swipe2.style.display = "none";
  });
}


// Function to handle "Next" button click event
document.getElementById("nextPageBtn").addEventListener("click", () => {
  const productList = document.querySelector(".product-list");
  currentPage++;
  productList.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the top of the product list
  renderProducts(); // Render products for the next page
});

// Function to handle "Previous" button click event
document.getElementById("prevPageBtn").addEventListener("click", () => {
  const productList = document.querySelector(".product-list");
  currentPage = Math.max(1, currentPage - 1);
  productList.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the top of the product list
  renderProducts(); // Render products for the previous page
});

// Fetch and render products on page load
fetchAndRenderProducts();
