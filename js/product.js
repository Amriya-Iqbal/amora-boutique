/* =========================================================
   AMORA BOUTIQUE - PRODUCT DETAILS CONTROLLER
========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const container = document.getElementById("product-detail");
        const relatedContainer = document.getElementById("related-products");

        if (!container || typeof products === "undefined") return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = Number(urlParams.get("id")) || 1; // default to first if none specified

        const product = products.find(p => p.id === productId);

        if (!product) {
            container.innerHTML = `
                <div class="empty-state-card" style="margin: 40px 0;">
                    <div class="icon-wrap"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <h2>Product Not Found</h2>
                    <p>We could not find the piece you are looking for. It may have sold out or been removed.</p>
                    <a href="shop.html" class="btn btn-primary">Return to Boutique Shop</a>
                </div>
            `;
            return;
        }

        // Selected options state
        let selectedSize = product.sizes && product.sizes.length ? product.sizes[0] : "Standard";
        let selectedColor = product.colors && product.colors.length ? product.colors[0] : "Default";
        let quantity = 1;

        // Render main product layout
        const galleryImages = product.gallery && product.gallery.length ? product.gallery : [product.image];
        const isWish = window.AmoraStore ? window.AmoraStore.isInWishlist(product.id) : false;

        container.innerHTML = `
            <div class="product-breadcrumb">
                <a href="index.html">Home</a> <span>/</span>
                <a href="shop.html">Shop</a> <span>/</span>
                <a href="shop.html?category=${product.category}">${product.category}</a> <span>/</span>
                <span style="color: var(--color-dark);">${product.name}</span>
            </div>

            <div class="product-detail-layout">
                <!-- Gallery Column -->
                <div class="product-gallery">
                    <div class="product-gallery-main">
                        <img id="main-product-img" src="${galleryImages[0]}" alt="${product.name}">
                    </div>
                    ${galleryImages.length > 1 ? `
                        <div class="product-gallery-thumbs">
                            ${galleryImages.map((img, idx) => `
                                <div class="gallery-thumb ${idx === 0 ? "is-active" : ""}" data-img="${img}">
                                    <img src="${img}" alt="${product.name} view ${idx + 1}">
                                </div>
                            `).join("")}
                        </div>
                    ` : ""}
                </div>

                <!-- Info Column -->
                <div class="product-info-panel">
                    <span class="eyebrow">${product.category}</span>
                    <h1>${product.name}</h1>

                    <div class="product-rating-row">
                        <div class="star-rating">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span><b>${product.rating || "5.0"}</b> (${product.reviewsCount || 24} reviews)</span>
                    </div>

                    <div class="product-detail-price-row">
                        <span class="product-detail-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="product-detail-original-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
                        ${product.originalPrice ? `<span class="product-badge sale">Save $${product.originalPrice - product.price}</span>` : ""}
                    </div>

                    <p class="product-detail-desc">${product.description}</p>

                    <!-- Size Selector -->
                    ${product.sizes && product.sizes.length ? `
                        <div class="selector-group">
                            <div class="selector-label-row">
                                <span>Select Size: <b id="selected-size-label">${selectedSize}</b></span>
                                <a href="contact.html" style="font-size: 11px; text-decoration: underline; color: var(--color-text-muted);">Size Guide</a>
                            </div>
                            <div class="size-pill-group">
                                ${product.sizes.map((sz, idx) => `
                                    <button type="button" class="size-pill ${idx === 0 ? "is-selected" : ""}" data-size="${sz}">
                                        ${sz}
                                    </button>
                                `).join("")}
                            </div>
                        </div>
                    ` : ""}

                    <!-- Color Selector -->
                    ${product.colors && product.colors.length ? `
                        <div class="selector-group">
                            <div class="selector-label-row">
                                <span>Color: <b id="selected-color-label">${selectedColor}</b></span>
                            </div>
                            <div class="color-swatch-group">
                                ${product.colors.map((col, idx) => `
                                    <button type="button" class="color-swatch-btn ${idx === 0 ? "is-selected" : ""}" data-color="${col}">
                                        ${col}
                                    </button>
                                `).join("")}
                            </div>
                        </div>
                    ` : ""}

                    <!-- Quantity and Add to Bag -->
                    <div class="purchase-row">
                        <div class="qty-stepper">
                            <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
                            <input type="number" id="qty-input" value="1" min="1" max="10" readonly>
                            <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" class="btn btn-primary btn-add-bag" id="btn-add-to-bag">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
                        </button>
                        <button type="button" class="btn-wishlist-detail ${isWish ? "is-active" : ""}" id="btn-toggle-wish" aria-label="Save to Wishlist">
                            <i class="${isWish ? "fa-solid" : "fa-regular"} fa-heart"></i>
                        </button>
                    </div>

                    <!-- Accordions -->
                    <div class="product-accordions">
                        <div class="accordion-item is-open">
                            <button type="button" class="accordion-trigger">
                                <span>Product Details & Silhouette</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="accordion-content">
                                <p>${product.details || "Carefully designed for effortless luxury, fluid movement, and timeless elegance in every stitch."}</p>
                            </div>
                        </div>

                        <div class="accordion-item">
                            <button type="button" class="accordion-trigger">
                                <span>Fabric & Sustainable Care</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="accordion-content">
                                <p><b>Material:</b> ${product.fabric || "Premium certified luxury textile"}</p>
                                <p><b>Care:</b> ${product.care || "Dry clean recommended or gentle cold hand wash."}</p>
                            </div>
                        </div>

                        <div class="accordion-item">
                            <button type="button" class="accordion-trigger">
                                <span>Complimentary Shipping & Returns</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="accordion-content">
                                <p>Enjoy complimentary tracked standard shipping on orders over $100. Hassle-free 30-day returns on all unworn items with original tags attached.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Thumbnail switcher
        const mainImg = document.getElementById("main-product-img");
        document.querySelectorAll(".gallery-thumb").forEach(thumb => {
            thumb.addEventListener("click", function () {
                document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("is-active"));
                this.classList.add("is-active");
                if (mainImg) mainImg.src = this.getAttribute("data-img");
            });
        });

        // Size Selector
        const sizeLabel = document.getElementById("selected-size-label");
        document.querySelectorAll(".size-pill").forEach(pill => {
            pill.addEventListener("click", function () {
                document.querySelectorAll(".size-pill").forEach(p => p.classList.remove("is-selected"));
                this.classList.add("is-selected");
                selectedSize = this.getAttribute("data-size");
                if (sizeLabel) sizeLabel.textContent = selectedSize;
            });
        });

        // Color Selector
        const colorLabel = document.getElementById("selected-color-label");
        document.querySelectorAll(".color-swatch-btn").forEach(swatch => {
            swatch.addEventListener("click", function () {
                document.querySelectorAll(".color-swatch-btn").forEach(s => s.classList.remove("is-selected"));
                this.classList.add("is-selected");
                selectedColor = this.getAttribute("data-color");
                if (colorLabel) colorLabel.textContent = selectedColor;
            });
        });

        // Quantity Stepper
        const qtyInput = document.getElementById("qty-input");
        const btnMinus = document.getElementById("qty-minus");
        const btnPlus = document.getElementById("qty-plus");

        if (btnMinus && btnPlus && qtyInput) {
            btnMinus.addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    qtyInput.value = quantity;
                }
            });
            btnPlus.addEventListener("click", () => {
                if (quantity < 10) {
                    quantity++;
                    qtyInput.value = quantity;
                }
            });
        }

        // Add to Bag Button
        const addBagBtn = document.getElementById("btn-add-to-bag");
        if (addBagBtn) {
            addBagBtn.addEventListener("click", function () {
                if (window.AmoraStore) {
                    window.AmoraStore.addToCart(product, quantity, selectedSize, selectedColor);
                }
            });
        }

        // Wishlist Button
        const wishBtn = document.getElementById("btn-toggle-wish");
        if (wishBtn) {
            wishBtn.addEventListener("click", function () {
                if (window.AmoraStore) {
                    window.AmoraStore.toggleWishlist(product);
                    const isNowWish = window.AmoraStore.isInWishlist(product.id);
                    wishBtn.classList.toggle("is-active", isNowWish);
                    const icon = wishBtn.querySelector("i");
                    if (icon) {
                        icon.className = isNowWish ? "fa-solid fa-heart" : "fa-regular fa-heart";
                    }
                }
            });
        }

        // Accordion Toggles
        document.querySelectorAll(".accordion-trigger").forEach(trigger => {
            trigger.addEventListener("click", function () {
                const item = this.closest(".accordion-item");
                if (item) {
                    item.classList.toggle("is-open");
                }
            });
        });

        // Render Related Products
        if (relatedContainer) {
            const related = products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4);

            relatedContainer.innerHTML = "";
            related.forEach(rel => {
                const card = document.createElement("article");
                card.className = "product-card";
                const isRelWish = window.AmoraStore ? window.AmoraStore.isInWishlist(rel.id) : false;

                card.innerHTML = `
                    <div class="product-card-media">
                        <button type="button" class="wishlist-toggle-btn ${isRelWish ? "is-active" : ""}" 
                                data-wishlist-id="${rel.id}" aria-label="Save to Wishlist">
                            <i class="${isRelWish ? "fa-solid" : "fa-regular"} fa-heart"></i>
                        </button>
                        <a href="product.html?id=${rel.id}" class="product-img-link">
                            <img src="${rel.image}" alt="${rel.name}" loading="lazy">
                        </a>
                        <div class="product-card-actions">
                            <button type="button" class="btn btn-quick-add" data-cart-id="${rel.id}">
                                <i class="fa-solid fa-bag-shopping"></i> Quick Add
                            </button>
                        </div>
                    </div>
                    <div class="product-card-info">
                        <p class="product-card-category">${rel.category}</p>
                        <h3 class="product-card-title">
                            <a href="product.html?id=${rel.id}">${rel.name}</a>
                        </h3>
                        <div class="product-card-price-row">
                            <span class="product-card-price">$${rel.price.toFixed(2)}</span>
                        </div>
                    </div>
                `;

                card.querySelector(".wishlist-toggle-btn").addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.AmoraStore) window.AmoraStore.toggleWishlist(rel);
                });

                card.querySelector(".btn-quick-add").addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.AmoraStore) window.AmoraStore.addToCart(rel, 1);
                });

                relatedContainer.appendChild(card);
            });
        }
    });

})();