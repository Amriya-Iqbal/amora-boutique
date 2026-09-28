/* =========================================================
   AMORA BOUTIQUE - LUXURY SHOP CATALOG CONTROLLER
========================================================= */

(function () {
    "use strict";

    const shopGrid = document.getElementById("shop-products");
    const searchInput = document.getElementById("product-search");
    const categorySelect = document.getElementById("category-filter");
    const sortSelect = document.getElementById("sort-products");
    const productCountEl = document.getElementById("product-count");
    const emptyStateEl = document.getElementById("no-products");
    const categoryPills = document.querySelectorAll(".category-pill");

    let currentCategory = "all";
    let currentSearch = "";
    let currentSort = "featured";

    function renderProducts(list) {
        if (!shopGrid) return;
        shopGrid.innerHTML = "";

        if (list.length === 0) {
            if (emptyStateEl) emptyStateEl.style.display = "block";
            if (productCountEl) productCountEl.textContent = "No pieces found matching your criteria.";
            return;
        }

        if (emptyStateEl) emptyStateEl.style.display = "none";
        if (productCountEl) {
            productCountEl.textContent = `Showing ${list.length} luxury ${list.length === 1 ? "piece" : "pieces"}`;
        }

        list.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";

            const isWish = window.AmoraStore ? window.AmoraStore.isInWishlist(product.id) : false;
            const discountBadge = product.originalPrice
                ? `<span class="product-badge sale">Save $${product.originalPrice - product.price}</span>`
                : (product.badge ? `<span class="product-badge">${product.badge}</span>` : "");

            card.innerHTML = `
                <div class="product-card-media">
                    ${discountBadge}
                    <button type="button" class="wishlist-toggle-btn ${isWish ? "is-active" : ""}" 
                            data-wishlist-id="${product.id}" aria-label="Save to Wishlist">
                        <i class="${isWish ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>
                    <a href="product.html?id=${product.id}" class="product-img-link">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </a>
                    <div class="product-card-actions">
                        <button type="button" class="btn btn-quick-add" data-cart-id="${product.id}">
                            <i class="fa-solid fa-bag-shopping"></i> Quick Add
                        </button>
                    </div>
                </div>
                <div class="product-card-info">
                    <p class="product-card-category">${product.category}</p>
                    <h3 class="product-card-title">
                        <a href="product.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-card-price-row">
                        <span class="product-card-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="product-card-original-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
                    </div>
                </div>
            `;

            // Heart / Wishlist button
            const wishBtn = card.querySelector(".wishlist-toggle-btn");
            wishBtn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                if (window.AmoraStore) window.AmoraStore.toggleWishlist(product);
            });

            // Quick Add to Cart button
            const quickAddBtn = card.querySelector(".btn-quick-add");
            quickAddBtn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                if (window.AmoraStore) window.AmoraStore.addToCart(product, 1);
            });

            shopGrid.appendChild(card);
        });
    }

    function applyFilters() {
        if (typeof products === "undefined") return;

        let filtered = products.filter(product => {
            const matchesCategory = currentCategory === "all" || product.category.toLowerCase() === currentCategory.toLowerCase();
            const term = currentSearch.toLowerCase();
            const matchesSearch = !term ||
                product.name.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term) ||
                (product.description && product.description.toLowerCase().includes(term));
            return matchesCategory && matchesSearch;
        });

        // Sorting
        if (currentSort === "low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === "high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (currentSort === "rating") {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (currentSort === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        renderProducts(filtered);
    }

    function setCategory(cat) {
        currentCategory = cat || "all";
        if (categorySelect) categorySelect.value = currentCategory;

        categoryPills.forEach(pill => {
            const pillCat = pill.getAttribute("data-category") || "all";
            pill.classList.toggle("is-active", pillCat.toLowerCase() === currentCategory.toLowerCase());
        });

        applyFilters();
    }

    document.addEventListener("DOMContentLoaded", function () {
        // Read URL query parameter for category
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get("category");
        if (urlCategory) {
            currentCategory = urlCategory;
        }

        setCategory(currentCategory);

        // Search input
        if (searchInput) {
            searchInput.addEventListener("input", function () {
                currentSearch = this.value.trim();
                applyFilters();
            });
        }

        // Category dropdown
        if (categorySelect) {
            categorySelect.addEventListener("change", function () {
                setCategory(this.value);
            });
        }

        // Category pills
        categoryPills.forEach(pill => {
            pill.addEventListener("click", function () {
                const cat = this.getAttribute("data-category") || "all";
                setCategory(cat);
            });
        });

        // Sort dropdown
        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                currentSort = this.value;
                applyFilters();
            });
        }

        // Clear filters button inside empty state
        const clearBtn = document.getElementById("clear-filters-btn");
        if (clearBtn) {
            clearBtn.addEventListener("click", function () {
                if (searchInput) searchInput.value = "";
                currentSearch = "";
                setCategory("all");
            });
        }

        // Re-render when wishlist updates in another tab or button
        window.addEventListener("amora:wishlistUpdated", function () {
            if (window.AmoraStore) window.AmoraStore.updateWishlistButtons();
        });
    });

})();