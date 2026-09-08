// =====================================================
// FIREBASE
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAc9iuAS9RA1orVpkwdSomkSiS07QLe0Ak",

    authDomain:
        "supreme-craft-india.firebaseapp.com",

    projectId:
        "supreme-craft-india",

    storageBucket:
        "supreme-craft-india.firebasestorage.app",

    messagingSenderId:
        "9064158877",

    appId:
        "1:9064158877:web:fa4319ebc7cf50a2fe2674",

    measurementId:
        "G-RQ9Z44PEX5"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);



// =====================================================
// GLOBAL PRODUCTS
// =====================================================

let products = [];

let selectedCategory = "all";



// =====================================================
// HERO SLIDER
// =====================================================

const heroImages = [

    "images/image1.jpg",

    "images/image2.jpg"

];


let currentHeroIndex = 0;

let heroTimer = null;


const heroImage =
    document.getElementById("heroImage");

const heroDots =
    document.getElementById("heroDots");

const heroPrev =
    document.getElementById("heroPrev");

const heroNext =
    document.getElementById("heroNext");



function showHeroSlide(index) {

    if (!heroImage ||
        heroImages.length === 0) {

        return;
    }


    currentHeroIndex =
        (
            index +
            heroImages.length
        ) %
        heroImages.length;


    heroImage.style.opacity = "0";


    setTimeout(function() {

        heroImage.src =
            heroImages[currentHeroIndex];

        heroImage.style.opacity = "1";

    }, 180);


    updateHeroDots();

}



function nextHeroSlide() {

    showHeroSlide(
        currentHeroIndex + 1
    );

}



function previousHeroSlide() {

    showHeroSlide(
        currentHeroIndex - 1
    );

}



function createHeroDots() {

    if (!heroDots) {
        return;
    }


    heroDots.innerHTML = "";


    heroImages.forEach(
        function(image, index) {

            const dot =
                document.createElement("button");


            dot.type = "button";


            dot.className =
                "hero-dot";


            dot.setAttribute(
                "aria-label",
                "Go to slide " +
                (index + 1)
            );


            dot.addEventListener(
                "click",
                function() {

                    showHeroSlide(index);

                    restartHeroTimer();

                }
            );


            heroDots.appendChild(dot);

        }
    );


    updateHeroDots();

}



function updateHeroDots() {

    if (!heroDots) {
        return;
    }


    const dots =
        heroDots.querySelectorAll(
            ".hero-dot"
        );


    dots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index === currentHeroIndex
            );

        }
    );

}



function startHeroTimer() {

    stopHeroTimer();


    heroTimer =
        setInterval(
            nextHeroSlide,
            5000
        );

}



function stopHeroTimer() {

    if (heroTimer !== null) {

        clearInterval(heroTimer);

        heroTimer = null;

    }

}



function restartHeroTimer() {

    startHeroTimer();

}



if (heroPrev) {

    heroPrev.addEventListener(
        "click",
        function() {

            previousHeroSlide();

            restartHeroTimer();

        }
    );

}



if (heroNext) {

    heroNext.addEventListener(
        "click",
        function() {

            nextHeroSlide();

            restartHeroTimer();

        }
    );

}



const heroSlider =
    document.querySelector(
        ".hero-slider"
    );


if (heroSlider) {

    heroSlider.addEventListener(
        "mouseenter",
        stopHeroTimer
    );


    heroSlider.addEventListener(
        "mouseleave",
        startHeroTimer
    );

}



createHeroDots();

showHeroSlide(0);

startHeroTimer();



// =====================================================
// FIRESTORE PRODUCTS
// =====================================================

async function loadProducts() {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading">
            Loading products...
        </div>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        products = [];


        snapshot.forEach(
            function(doc) {

                const data =
                    doc.data();


                products.push({

                    id:
                        doc.id,

                    ...data

                });

            }
        );


        renderProducts();

    }
    catch (error) {

        console.error(
            "Firestore error:",
            error
        );


        container.innerHTML = `
            <div class="product-error">
                <h3>
                    Products could not be loaded.
                </h3>

                <p>
                    Please refresh the page.
                </p>
            </div>
        `;

    }

}



// =====================================================
// GET PRODUCT IMAGE
// =====================================================

function getProductImage(product) {

    if (
        Array.isArray(product.images) &&
        product.images.length > 0 &&
        product.images[0]
    ) {

        return product.images[0];

    }


    if (
        typeof product.image === "string" &&
        product.image.trim() !== ""
    ) {

        return product.image;

    }


    return "images/image1.jpg";

}



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts() {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (!container) {
        return;
    }


    let filteredProducts;


    if (selectedCategory === "all") {

        filteredProducts =
            products;

    }
    else {

        filteredProducts =
            products.filter(
                function(product) {

                    return String(
                        product.category || ""
                    )
                    .toLowerCase()
                    .trim() ===
                    selectedCategory;

                }
            );

    }


    if (filteredProducts.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <h3>
                    No products found
                </h3>

                <p>
                    Products will appear here
                    when they are added from
                    the admin panel.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredProducts
        .map(
            function(product) {

                return createProductCard(
                    product
                );

            }
        )
        .join("");



    attachProductEvents();

}



// =====================================================
// PRODUCT CARD
// =====================================================

function createProductCard(product) {

    const image =
        getProductImage(product);


    const name =
        escapeHTML(
            product.name ||
            "Unnamed Product"
        );


    const category =
        escapeHTML(
            product.category ||
            "Furniture"
        );


    const description =
        escapeHTML(
            product.description ||
            "Premium quality furniture."
        );


    const price =
        Number(
            product.price || 0
        );


    return `

        <article class="product-card">

            <a
                class="product-image-link"
                href="product.html?id=${encodeURIComponent(product.id)}"
            >

                <img
                    class="product-card-image"
                    src="${escapeHTML(image)}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='images/image1.jpg';"
                >

            </a>


            <div class="product-info">

                <span class="product-category">
                    ${category}
                </span>


                <h3>
                    ${name}
                </h3>


                <p>
                    ${description}
                </p>


                <div class="product-price">
                    ₹${price.toLocaleString("en-IN")}
                </div>


                <div class="product-actions">

                    <a
                        href="product.html?id=${encodeURIComponent(product.id)}"
                        class="product-btn view-btn"
                    >
                        View
                    </a>


                    <button
                        type="button"
                        class="product-btn add-cart-btn"
                        data-product-id="${escapeHTML(product.id)}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `;

}



// =====================================================
// PRODUCT EVENTS
// =====================================================

function attachProductEvents() {

    const buttons =
        document.querySelectorAll(
            ".add-cart-btn"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        button.dataset.productId;


                    const product =
                        products.find(
                            function(item) {

                                return item.id ===
                                    productId;

                            }
                        );


                    if (product) {

                        addToCart(
                            product,
                            1
                        );

                    }

                }
            );

        }
    );

}



// =====================================================
// CATEGORY FILTER
// =====================================================

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


categoryButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                categoryButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedCategory =
                    button.dataset.category ||
                    "all";


                renderProducts();

            }
        );

    }
);



// =====================================================
// CART
// =====================================================

function getCart() {

    try {

        const savedCart =
            localStorage.getItem("cart");


        const cart =
            savedCart
                ? JSON.parse(savedCart)
                : [];


        return Array.isArray(cart)
            ? cart
            : [];

    }
    catch (error) {

        console.error(
            "Cart read error:",
            error
        );

        return [];

    }

}



function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

}



function addToCart(product, quantity = 1) {

    const cart =
        getCart();


    const productId =
        String(
            product.id ||
            product.name
        );


    const existing =
        cart.find(
            function(item) {

                return String(
                    item.id ||
                    item.name
                ) === productId;

            }
        );


    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 0
            ) +
            Number(quantity);

    }
    else {

        cart.push({

            id:
                product.id || "",

            name:
                product.name || "Product",

            price:
                Number(product.price || 0),

            quantity:
                Number(quantity || 1),

            image:
                getProductImage(product)

        });

    }


    saveCart(cart);


    alert(
        product.name +
        " added to cart!"
    );

}



function updateCartCount() {

    const cart =
        getCart();


    const total =
        cart.reduce(
            function(sum, item) {

                return sum +
                    Number(
                        item.quantity || 0
                    );

            },
            0
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            total;

    }

}



// =====================================================
// INITIALIZE
// =====================================================

updateCartCount();

loadProducts();