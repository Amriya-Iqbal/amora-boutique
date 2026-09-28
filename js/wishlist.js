

(function () {
    "use strict";

    function renderWishlist() {
        const wishlistContainer = document.getElementById("wishlist-products");
        const emptyState = document.getElementById("empty-wishlist");

        if (!wishlistContainer) return;

        const wishlist = window.AmoraStore ? window.AmoraStore.getWishlist() : [];

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = "";
            wishlistContainer.style.display = "none";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";
        wishlistContainer.style.display = "grid";
        wishlistContainer.innerHTML = "";

        wishlist.forEach(product => {
            const card = document.createElement("article");
            card.className = "wishlist-card";

            card.innerHTML = `
                <div class="wishlist-card-media">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </a>
                </div>
                <div class="wishlist-card-body">
                    <span class="category">${product.category || "Collection"}</span>
                    <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                    <div class="price">$${Number(product.price).toFixed(2)}</div>
                    <div class="wishlist-card-actions">
                        <button type="button" class="btn btn-primary btn-move-cart">
                            <i class="fa-solid fa-bag-shopping"></i> Move to Bag
                        </button>
                        <button type="button" class="btn-remove-wishlist" aria-label="Remove from wishlist">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;

            // Move to Cart
            card.querySelector(".btn-move-cart").addEventListener("click", () => {
                if (window.AmoraStore) {
                    window.AmoraStore.addToCart(product, 1);
                    window.AmoraStore.toggleWishlist(product.id);
                    renderWishlist();
                }
            });

            // Remove from Wishlist
            card.querySelector(".btn-remove-wishlist").addEventListener("click", () => {
                if (window.AmoraStore) {
                    window.AmoraStore.toggleWishlist(product.id);
                    renderWishlist();
                }
            });

            wishlistContainer.appendChild(card);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderWishlist();

        // Listen for storage changes from other tabs
        window.addEventListener("amora:wishlistUpdated", renderWishlist);
    });

})();