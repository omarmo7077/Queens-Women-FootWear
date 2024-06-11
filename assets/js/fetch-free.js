// Function to setup hover effect for a product item
function setupHoverEffect(productItem) {
  // Get the images inside the current product item
  var images = productItem.querySelectorAll(".image-contain");

  // Function to show the second image
  function showSecondImage() {
    images[0].style.display = "none";
    images[1].style.display = "block";
  }

  // Function to show the first image
  function showFirstImage() {
    images[0].style.display = "block";
    images[1].style.display = "none";
  }

  // Add event listener for mouseenter (hover in)
  productItem.addEventListener("mouseenter", showSecondImage);

  // Add event listener for mouseleave (hover out)
  productItem.addEventListener("mouseleave", showFirstImage);

  // Add event listener for touchstart (tap in)
  productItem.addEventListener("touchstart", function () {
    // Prevent the touch event from triggering a click
    event.preventDefault();
    showSecondImage();
  });

  // Add event listener for touchend (tap out)
  productItem.addEventListener("touchend", function () {
    showFirstImage();
  });

  // Add event listener for touchcancel (in case the touch action is interrupted)
  productItem.addEventListener("touchcancel", showFirstImage);
}

// Function to fetch and render products
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
        const productOverview = document.querySelector(".product-overview");
        productOverview.innerHTML = ""; // Clear existing products from the overview

        // Shuffle the product data
        const shuffledData = shuffle(Object.entries(data));

        // Limit the number of products to be displayed to 12
        const limitedData = shuffledData.slice(0, 12);

        // Iterate through the limited data and render each product
        limitedData.forEach(([key, product]) => {
          const productCard = document.createElement("div");
          productCard.classList.add("product-card-overview");

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
                        <div class="product-card" tabindex="0" >
                            <figure class="card-banner" id="cardBanner">
                                <img src="${product["product-photo"]}" width="312" height="350" alt="${product["product-title"]}" class="image-contain" id="swipe1">
                                <img src="${product["product-photo2"]}" width="312" height="350" id="swipe2" class="image-contain" style="display: none;">
                                <ul class="card-action-list">
                                    <li class="card-action-item">
                                        <button class="card-action-btn add-to-cart-btn" aria-labelledby="card-label-1" data-product-id="${key}">
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

          // Append product card to the product overview
          productOverview.appendChild(productCard);

          // Set up hover effect for the newly created product card
          setupHoverEffect(productCard);
        });

        // Set up event listeners for "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
        addToCartButtons.forEach((button) =>
          button.addEventListener("click", (event) => {
            const productId =
              event.target.closest(".add-to-cart-btn").dataset.productId;
            openCartModal(productId);
          })
        );
      } else {
        console.log("No products found");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Helper function to get color value from the product data
function getColorValue(product, color) {
  if (product.sizes) {
    for (const size in product.sizes) {
      if (product.sizes[size][color]) {
        return product.sizes[size][color]["color-value"];
      }
    }
  }
  return "#000000"; // Default color if not found
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

// Fetch and render products on page load
window.addEventListener("load", fetchAndRenderProducts);

// Shuffle function to randomize the order of elements in an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
