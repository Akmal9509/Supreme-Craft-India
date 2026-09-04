// ========================================
// SUPREME CRAFT INDIA
// COMPLETE MAIN JAVASCRIPT
// ========================================


// ========================================
// WHATSAPP ORDER
// ========================================

function orderProduct(productName, price) {

    const phoneNumber = "919509393894";

    const message =
        "Hello Supreme Craft India,\n\n" +
        "I want to order:\n" +
        "Product: " + productName + "\n" +
        "Price: ₹" + price + "\n\n" +
        "Please provide more details.";

    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
}


// ========================================
// CART
// ========================================

function addToCart(productName, price, quantity = 1) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct =
        cart.find(
            product =>
                product.name === productName
        );

    if (existingProduct) {

        existingProduct.quantity +=
            Number(quantity);

    } else {

        cart.push({
            name: productName,
            price: Number(price),
            quantity: Number(quantity)
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(
        productName +
        " added to cart!"
    );
}


// ========================================
// CART COUNT
// ========================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const totalItems =
        cart.reduce(
            (total, product) => {

                return total +
                    Number(
                        product.quantity || 0
                    );

            },
            0
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if (cartCount) {

        cartCount.innerText =
            totalItems;

    }
}


// ========================================
// GET PRODUCTS
// ========================================

function getProducts() {

    return JSON.parse(
        localStorage.getItem("products")
    ) || [];

}


// ========================================
// LOAD PRODUCTS
// ========================================

function loadProducts() {

    const products =
        getProducts();

    const container =
        document.getElementById(
            "productContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (products.length === 0) {

        container.innerHTML = `

            <div class="no-products">

                <h3>
                    No Products Available
                </h3>

                <p>
                    Please add products from Admin Panel.
                </p>

            </div>

        `;

        return;
    }


    products.forEach(
        function(product, index) {

            const name =
                product.name ||
                "Premium Furniture";


            const price =
                Number(product.price) || 0;


            const category =
                product.category ||
                "sofa";


            const description =
                product.description ||
                "Premium quality furniture designed for modern living.";


            let images = [];


            if (
                Array.isArray(product.images) &&
                product.images.length > 0
            ) {

                images =
                    product.images;

            } else if (
                product.image
            ) {

                images = [
                    product.image
                ];

            } else {

                images = [
                    "images/image1.jpg"
                ];

            }


            container.innerHTML += `

                <div
                    class="product-card"
                    data-category="${category}"
                >

                    <!-- PRODUCT IMAGE -->

                    <div class="product-slider">

                        <a
                            href="product.html?id=${index}"
                        >

                            <img
                                id="productImage${index}"
                                src="${images[0]}"
                                alt="${name}"
                            >

                        </a>


                        ${
                            images.length > 1
                            ? `

                                <button
                                    class="slider-prev"
                                    onclick="changeProductImage(${index}, -1)"
                                >
                                    ❮
                                </button>

                                <button
                                    class="slider-next"
                                    onclick="changeProductImage(${index}, 1)"
                                >
                                    ❯
                                </button>

                                <div
                                    class="slider-dots"
                                    id="sliderDots${index}"
                                ></div>

                            `
                            : ""
                        }

                    </div>


                    <!-- PRODUCT INFO -->

                    <div class="product-info">

                        <span>
                            ${escapeHTML(
                                category.toUpperCase()
                            )}
                        </span>


                        <h3>

                            <a
                                href="product.html?id=${index}"
                            >
                                ${escapeHTML(name)}
                            </a>

                        </h3>


                        <p>
                            ${escapeHTML(description)}
                        </p>


                        <h4>
                            ₹${price.toLocaleString("en-IN")}
                        </h4>


                        <button
                            onclick="addProductFromAdmin(${index})"
                        >
                            🛒 Add to Cart
                        </button>

                    </div>

                </div>

            `;


            if (images.length > 1) {

                createSliderDots(
                    index,
                    images.length
                );

            }

        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// PRODUCT IMAGE SLIDER
// ========================================

let productSliderIndexes = {};


// ========================================
// CHANGE PRODUCT IMAGE
// ========================================

function changeProductImage(
    productIndex,
    direction
) {

    const products =
        getProducts();

    const product =
        products[productIndex];

    if (!product) {
        return;
    }


    let images =
        Array.isArray(product.images) &&
        product.images.length
        ? product.images
        : [product.image];


    if (images.length <= 1) {
        return;
    }


    if (
        productSliderIndexes[productIndex]
        === undefined
    ) {

        productSliderIndexes[productIndex] = 0;

    }


    productSliderIndexes[productIndex]
        += direction;


    if (
        productSliderIndexes[productIndex]
        >= images.length
    ) {

        productSliderIndexes[productIndex] = 0;

    }


    if (
        productSliderIndexes[productIndex]
        < 0
    ) {

        productSliderIndexes[productIndex] =
            images.length - 1;

    }


    const currentIndex =
        productSliderIndexes[productIndex];


    const image =
        document.getElementById(
            "productImage" +
            productIndex
        );


    if (image) {

        image.src =
            images[currentIndex];

    }


    updateSliderDots(
        productIndex,
        currentIndex
    );

}


// ========================================
// CREATE PRODUCT DOTS
// ========================================

function createSliderDots(
    productIndex,
    imageCount
) {

    const container =
        document.getElementById(
            "sliderDots" +
            productIndex
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    for (
        let i = 0;
        i < imageCount;
        i++
    ) {

        const dot =
            document.createElement(
                "span"
            );

        dot.className =
            "slider-dot";


        if (i === 0) {

            dot.classList.add(
                "active"
            );

        }


        container.appendChild(dot);

    }

}


// ========================================
// UPDATE PRODUCT DOTS
// ========================================

function updateSliderDots(
    productIndex,
    currentIndex
) {

    const container =
        document.getElementById(
            "sliderDots" +
            productIndex
        );

    if (!container) {
        return;
    }


    const dots =
        container.querySelectorAll(
            ".slider-dot"
        );


    dots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        }
    );

}


// ========================================
// ADD ADMIN PRODUCT TO CART
// ========================================

function addProductFromAdmin(index) {

    const products =
        getProducts();

    const product =
        products[index];

    if (!product) {
        return;
    }


    addToCart(
        product.name,
        product.price,
        1
    );

}


// ========================================
// CATEGORY FILTER
// ========================================

function filterProducts(category) {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(
        function(product) {

            if (
                category === "all" ||
                product.dataset.category === category
            ) {

                product.style.display =
                    "block";

            } else {

                product.style.display =
                    "none";

            }

        }
    );

}


// ========================================
// HERO SLIDER
// ========================================

const heroImages = [

    "images/image1.jpg",
    "images/image2.jpg"

];


let currentHeroImage = 0;


// ========================================
// SHOW HERO
// ========================================

function showHeroImage() {

    const heroImage =
        document.getElementById(
            "heroImage"
        );

    if (!heroImage) {
        return;
    }


    heroImage.src =
        heroImages[currentHeroImage];


    updateHeroDots();

}


// ========================================
// CHANGE HERO
// ========================================

function changeHeroImage(direction) {

    currentHeroImage +=
        direction;


    if (
        currentHeroImage >=
        heroImages.length
    ) {

        currentHeroImage = 0;

    }


    if (
        currentHeroImage < 0
    ) {

        currentHeroImage =
            heroImages.length - 1;

    }


    showHeroImage();

}


// ========================================
// CREATE HERO DOTS
// ========================================

function createHeroDots() {

    const dots =
        document.getElementById(
            "heroDots"
        );

    if (!dots) {
        return;
    }


    dots.innerHTML = "";


    heroImages.forEach(
        function(image, index) {

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "hero-dot";


            if (index === 0) {

                dot.classList.add(
                    "active"
                );

            }


            dot.addEventListener(
                "click",
                function() {

                    currentHeroImage =
                        index;

                    showHeroImage();

                }
            );


            dots.appendChild(dot);

        }
    );

}


// ========================================
// UPDATE HERO DOTS
// ========================================

function updateHeroDots() {

    const dots =
        document.querySelectorAll(
            ".hero-dot"
        );


    dots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index === currentHeroImage
            );

        }
    );

}


// ========================================
// START WEBSITE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProducts();

        updateCartCount();

        createHeroDots();

        showHeroImage();

    }
);


// ========================================
// HERO AUTO SLIDER
// ========================================

setInterval(
    function() {

        const heroImage =
            document.getElementById(
                "heroImage"
            );

        if (!heroImage) {
            return;
        }

        changeHeroImage(1);

    },
    5000
);