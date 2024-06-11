//add to cart action
function addToCart() {
  const title = document.getElementById("productTitle").innerText;
  const brandName = document.getElementById("BrandName").innerText;
  const productPrice = document.getElementById("productPrice").innerText;
  const productSize = document.getElementById("product-Size").innerText;
  const productColor = document.getElementById("product-color").innerText;
  const productID = document.getElementById("productID").innerText;

  // Get the reference to the img element
  const productImage = document.getElementById("productImage");

  // Get the src attribute value
  const srcValue = productImage.getAttribute("src");

  const newItem = {
    id: productID,
    brand: brandName,
    title: title,
    productSize: productSize,
    productColor: productColor,
    price: productPrice,
    photourl: srcValue,
  };

  // Retrieve cart from local storage or initialize it as an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Add the new item to the cart
  cart.push(newItem);

  // Store the updated cart back to local storage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Change button text and add a message using SweetAlert
  Swal.fire({
    icon: "success",
    title: "Added to Cart",
    showConfirmButton: false,
    timer: 1500, // Close the alert after 1.5 seconds
  });

  // Function to reload the window
  function reloadWindow() {
    location.reload();
  }
}

// Function to open the cart modal with product details
function openCartModal(productId) {
  // Add class to body to prevent background scrolling
  document.body.classList.add("modal-open");

  // Fetch product details from the specific URL
  fetch(
    `https://queen-s-footwear-default-rtdb.firebaseio.com/Products/${productId}.json`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((product) => {
      // Render product details in the modal
      const modalContent = document.querySelector(".modal-content");

      modalContent.productDetails = product; // Store product details in the modal content

      modalContent.innerHTML = `
        <div class="flex center flex-end width-available" onclick="closeModal()">
          <button type="button" class="Add-to-Cart" id="perv4Button" >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <h5 class="m-5" id="BrandName">${product["Brand-Name"]}</h5>
        <h2 class="m-5" id="productTitle">${product["product-title"]}</h2>
        <div class="m-5 flex align-items">
            <p id="productPrice"> ${product["Product-Price"]} EGP</p>
        </div>
        
        <div class="content-photo-container flex center">
          <button id="previous-button" class="previous-button none-op" onclick="previousImage()">
            <i class="bi bi-arrow-left-short arrow"></i>
          </button>
          <img id="productImage" class="m-5 product-image active" style="height: min-content;width: 30%;" src="${
            product["product-photo"]
          }" alt="Product Image">
          <img id="productImage2" class="m-5 product-image" style="height: min-content;width: 30%;" src="${
            product["product-photo2"]
          }" alt="Product Image">
          <button id="next-button" class="next-button none-op" onclick="nextImage()">
            <i class="bi bi-arrow-right-short arrow"></i>
          </button>
        </div>
        
      
        <h3 class="m-5 flex center align-items">Size: <p id="product-Size"></p></h3>
        <ul class="m-5 flex">${Object.keys(product.sizes)
          .map(
            (size) =>
              `<div class="size-radio m-5" onclick="SizeRef('${size}')"><label class="radio-input_option"><span class="size-value">${size}</span></label></div>`
          )
          .join("")}</ul>
        <h3 class="m-5 flex">Color: <p id="product-color"></p></h3>
        <ul id="product-colors" class="m-5 flex flex-wrap hidden"></ul>
        <div class="m-5 flex align-items">
         SKU :<p id="productID">${productId}</p> 
        </div>
        <div class="m-5">
          <button id="addToCartButton" onclick="addToCart()" class="Add-to-Cart" disabled style="opacity: 0.5;">Add to Cart <i class="bi bi-exclamation-lg"></i></button>
        </div>
      `;

      // const modal = document.querySelector(".modal");
      // modal.style.display = "flex";
      const modal = document.querySelector(".modal");
      document.body.style.overflow = "hidden"; // Hide body overflow
      modal.classList.add("show"); // Show modal with animation
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
    });
}

// Function to close the modal
// function closeModal() {
//   const modal = document.querySelector(".modal");
//   modal.style.display = "none";

//   // Remove class from body to allow background scrolling
//   document.body.classList.remove("modal-open");
// }
function closeModal() {
  const modal = document.querySelector(".modal");
  document.body.style.overflow = "auto"; // Restore body overflow
  modal.classList.remove("show"); // Hide modal with animation
}

function colorRef(color) {
  const modalContent = document.querySelector(".modal-content");
  const product = modalContent.productDetails;
  const size = document.getElementById("product-Size").innerText;

  const choosedColor = document.getElementById("product-color");
  choosedColor.innerText = color;

  // Update the images based on the selected color
  if (product.sizes[size] && product.sizes[size][color]) {
    const colorDetails = product.sizes[size][color];
    document.getElementById("productImage").src = colorDetails.img1;
    document.getElementById("productImage2").src = colorDetails.img2;
  }

  // Update the add to cart button state
  updateAddToCartButtonState();
}

function SizeRef(size) {
  // Get the product details from the modal content
  const modalContent = document.querySelector(".modal-content");
  const product = modalContent.productDetails;
  const choosedsize = document.getElementById("product-Size");

  // Clear the color when the size changes to prevent semantic errors
  const choosedColor = document.getElementById("product-color");
  choosedColor.innerText = "";

  choosedsize.innerText = size;

  // Find the colors available for the selected size
  const colorsForSize = product.sizes[size];

  // Render the colors for the selected size with the onclick attribute
  const colorList = modalContent.querySelector("#product-colors");
  colorList.innerHTML = Object.keys(colorsForSize)
    .map(
      (color) =>
        `<div class="color-option" data-color-name="${color}" style="background-color: ${colorsForSize[color]["color-value"]}" onclick="colorRef('${color}')"></div>`
    )
    .join("");
  colorList.classList.remove("hidden");

  // Update the add to cart button state
  updateAddToCartButtonState();
}

function updateAddToCartButtonState() {
  const size = document.getElementById("product-Size").innerText;
  const color = document.getElementById("product-color").innerText;
  const addToCartButton = document.getElementById("addToCartButton");

  if (size && color) {
    addToCartButton.disabled = false;
    addToCartButton.style.opacity = 1;
    addToCartButton.innerHTML = 'Add to Cart <i class="bi bi-bag-check"></i>';
    addToCartButton.onclick = addToCart;
  } else {
    addToCartButton.disabled = true;
    addToCartButton.style.opacity = 0.5;
    addToCartButton.innerHTML =
      'Add to Cart <i class="bi bi-exclamation-lg"></i>';
    addToCartButton.onclick = null;
  }
}

// Function to show the previous image
function previousImage() {
  const img1 = document.getElementById("productImage");
  const img2 = document.getElementById("productImage2");

  if (img1.classList.contains("active")) {
    img1.classList.remove("active");
    img2.classList.add("active");
  } else {
    img2.classList.remove("active");
    img1.classList.add("active");
  }
}

// Function to show the next image
function nextImage() {
  const img1 = document.getElementById("productImage");
  const img2 = document.getElementById("productImage2");

  if (img1.classList.contains("active")) {
    img1.classList.remove("active");
    img2.classList.add("active");
  } else {
    img2.classList.remove("active");
    img1.classList.add("active");
  }
}
