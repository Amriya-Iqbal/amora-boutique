

(function () {
    "use strict";


    const AmoraStore = {
        // --- CART ---
        getCart: function () {
            try {
                const stored = localStorage.getItem("amoraCart");
                const items = stored ? JSON.parse(stored) : [];
                // Normalize items to prevent string/NaN issues
                return items.map(item => ({
                    ...item,
                    id: Number(item.id),
                    price: Number(item.price) || 0,
                    quantity: Math.max(1, Number(item.quantity) || 1)
                }));
            } catch (e) {
                console.error("Error reading cart from localStorage:", e);
                return [];
            }
        },

        saveCart: function (cart) {
            try {
                localStorage.setItem("amoraCart", JSON.stringify(cart));
                AmoraStore.updateBadges();
                window.dispatchEvent(new CustomEvent("amora:cartUpdated", { detail: { cart } }));
            } catch (e) {
                console.error("Error saving cart:", e);
            }
        },

        addToCart: function (productOrId, quantity = 1, size = null, color = null) {
            let product = null;
            if (typeof productOrId === "object" && productOrId !== null) {
                product = productOrId;
            } else if (typeof products !== "undefined") {
                product = products.find(p => p.id === Number(productOrId));
            }

            if (!product) {
                console.warn("Product not found to add to cart:", productOrId);
                return;
            }

            const chosenSize = size || (product.sizes && product.sizes.length ? product.sizes[0] : "Standard");
            const chosenColor = color || (product.colors && product.colors.length ? product.colors[0] : "Default");
            const cart = AmoraStore.getCart();

            const existingIndex = cart.findIndex(
                item => item.id === product.id && item.size === chosenSize && item.color === chosenColor
            );

            if (existingIndex > -1) {
                cart[existingIndex].quantity = Math.min(10, cart[existingIndex].quantity + quantity);
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    category: product.category,
                    size: chosenSize,
                    color: chosenColor,
                    quantity: Math.min(10, Math.max(1, quantity))
                });
            }

            AmoraStore.saveCart(cart);

            AmoraToast.show({
                title: "Added to Shopping Bag",
                message: `${product.name} (${chosenSize})`,
                image: product.image,
                actionText: "View Bag",
                actionUrl: "cart.html"
            });
        },

        removeFromCart: function (id, size, color) {
            let cart = AmoraStore.getCart();
            cart = cart.filter(item => {
                const match = item.id === Number(id) &&
                    (!size || item.size === size) &&
                    (!color || item.color === color);
                return !match;
            });
            AmoraStore.saveCart(cart);
            AmoraToast.show({
                title: "Item Removed",
                message: "The piece was removed from your bag.",
                type: "info"
            });
        },

        updateCartQuantity: function (id, size, color, delta) {
            const cart = AmoraStore.getCart();
            const item = cart.find(
                i => i.id === Number(id) && (!size || i.size === size) && (!color || i.color === color)
            );

            if (!item) return;

            const newQty = item.quantity + delta;
            if (newQty <= 0) {
                AmoraStore.removeFromCart(id, size, color);
            } else {
                item.quantity = Math.min(10, newQty);
                AmoraStore.saveCart(cart);
            }
        },

        // --- WISHLIST ---
        getWishlist: function () {
            try {
                const stored = localStorage.getItem("amoraWishlist");
                const items = stored ? JSON.parse(stored) : [];
                return items.map(item => ({
                    ...item,
                    id: Number(item.id),
                    price: Number(item.price) || 0
                }));
            } catch (e) {
                console.error("Error reading wishlist:", e);
                return [];
            }
        },

        saveWishlist: function (wishlist) {
            try {
                localStorage.setItem("amoraWishlist", JSON.stringify(wishlist));
                AmoraStore.updateBadges();
                AmoraStore.updateWishlistButtons();
                window.dispatchEvent(new CustomEvent("amora:wishlistUpdated", { detail: { wishlist } }));
            } catch (e) {
                console.error("Error saving wishlist:", e);
            }
        },

        isInWishlist: function (productId) {
            const wishlist = AmoraStore.getWishlist();
            return wishlist.some(item => item.id === Number(productId));
        },

        toggleWishlist: function (productOrId) {
            let product = null;
            if (typeof productOrId === "object" && productOrId !== null) {
                product = productOrId;
            } else if (typeof products !== "undefined") {
                product = products.find(p => p.id === Number(productOrId));
            }

            if (!product) return;

            const wishlist = AmoraStore.getWishlist();
            const existingIndex = wishlist.findIndex(item => item.id === product.id);

            if (existingIndex > -1) {
                wishlist.splice(existingIndex, 1);
                AmoraStore.saveWishlist(wishlist);
                AmoraToast.show({
                    title: "Removed from Wishlist",
                    message: `${product.name} removed.`,
                    type: "info"
                });
            } else {
                wishlist.push({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: Number(product.price),
                    image: product.image,
                    description: product.description || ""
                });
                AmoraStore.saveWishlist(wishlist);
                AmoraToast.show({
                    title: "Saved to Wishlist ",
                    message: `${product.name} has been saved.`,
                    image: product.image,
                    actionText: "View Wishlist",
                    actionUrl: "wishlist.html"
                });
            }
        },

        // --- BADGES ---
        updateBadges: function () {
            const cart = AmoraStore.getCart();
            const totalCartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

            const wishlist = AmoraStore.getWishlist();
            const totalWishlistCount = wishlist.length;

            document.querySelectorAll(".cart-count, #cart-count").forEach(badge => {
                badge.textContent = totalCartCount;
                badge.classList.toggle("has-count", totalCartCount > 0);
            });

            document.querySelectorAll(".wishlist-count, #wishlist-count").forEach(badge => {
                badge.textContent = totalWishlistCount;
                badge.classList.toggle("has-count", totalWishlistCount > 0);
            });
        },

        updateWishlistButtons: function () {
            const wishlist = AmoraStore.getWishlist();
            const ids = new Set(wishlist.map(i => i.id));

            document.querySelectorAll("[data-wishlist-id]").forEach(btn => {
                const id = Number(btn.getAttribute("data-wishlist-id"));
                const isActive = ids.has(id);
                btn.classList.toggle("is-active", isActive);
                btn.setAttribute("aria-label", isActive ? "Remove from wishlist" : "Add to wishlist");
                const icon = btn.querySelector("i");
                if (icon) {
                    if (isActive) {
                        icon.classList.remove("fa-regular");
                        icon.classList.add("fa-solid");
                    } else {
                        icon.classList.remove("fa-solid");
                        icon.classList.add("fa-regular");
                    }
                }
            });
        }
    };

    window.AmoraStore = AmoraStore;


    /* =========================================================
       2. AMORA TOAST NOTIFICATION SYSTEM
    ========================================================= */

    const AmoraToast = {
        container: null,

        init: function () {
            if (!this.container) {
                this.container = document.createElement("div");
                this.container.id = "amora-toast-container";
                this.container.className = "amora-toast-container";
                document.body.appendChild(this.container);
            }
        },

        show: function (options) {
            this.init();

            const toast = document.createElement("div");
            toast.className = `amora-toast ${options.type || "success"}`;

            let html = "";
            if (options.image) {
                html += `<div class="toast-img-wrap"><img src="${options.image}" alt=""></div>`;
            } else {
                html += `<div class="toast-icon-wrap"><i class="fa-solid ${options.type === "info" ? "fa-circle-info" : "fa-check"}"></i></div>`;
            }

            html += `
                <div class="toast-body">
                    <h5 class="toast-title">${options.title || "Notification"}</h5>
                    ${options.message ? `<p class="toast-desc">${options.message}</p>` : ""}
                    ${options.actionText && options.actionUrl ? `<a href="${options.actionUrl}" class="toast-action">${options.actionText} →</a>` : ""}
                </div>
                <button type="button" class="toast-close" aria-label="Dismiss">&times;</button>
                <div class="toast-progress"></div>
            `;

            toast.innerHTML = html;

            toast.querySelector(".toast-close").addEventListener("click", () => {
                this.dismiss(toast);
            });

            this.container.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
                toast.classList.add("is-visible");
            });

            // Auto dismiss after 4 seconds
            const timer = setTimeout(() => {
                this.dismiss(toast);
            }, 4000);

            toast.addEventListener("mouseenter", () => {
                clearTimeout(timer);
                const bar = toast.querySelector(".toast-progress");
                if (bar) bar.style.animationPlayState = "paused";
            });
        },

        dismiss: function (toast) {
            toast.classList.remove("is-visible");
            toast.classList.add("is-hiding");
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 350);
        }
    };

    window.AmoraToast = AmoraToast;


    /* =========================================================
       3. NAVIGATION & MOBILE DRAWER CONTROLLER
    ========================================================= */

    function initNavigation() {
        const header = document.querySelector(".site-header, .header");
        const menuToggles = document.querySelectorAll(".menu-toggle, .mobile-menu-button, .hamburger, #menu-toggle, #mobile-menu-button");
        const mobileDrawer = document.querySelector(".mobile-nav-drawer, .mobile-menu");
        const mobileOverlay = document.querySelector(".mobile-nav-overlay");

        // Sticky Header scroll styling
        if (header) {
            window.addEventListener("scroll", () => {
                if (window.scrollY > 20) {
                    header.classList.add("is-scrolled");
                } else {
                    header.classList.remove("is-scrolled");
                }
            }, { passive: true });
        }

        // Mobile drawer toggle
        function toggleDrawer(open) {
            const shouldOpen = open !== undefined ? open : !document.body.classList.contains("mobile-menu-open");
            document.body.classList.toggle("mobile-menu-open", shouldOpen);
            menuToggles.forEach(btn => btn.classList.toggle("is-active", shouldOpen));
            if (mobileDrawer) mobileDrawer.classList.toggle("is-active", shouldOpen);
            if (mobileOverlay) mobileOverlay.classList.toggle("is-active", shouldOpen);
        }

        menuToggles.forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                toggleDrawer();
            });
        });

        if (mobileOverlay) {
            mobileOverlay.addEventListener("click", () => toggleDrawer(false));
        }

        // Close on ESC
        document.addEventListener("keydown", e => {
            if (e.key === "Escape" && document.body.classList.contains("mobile-menu-open")) {
                toggleDrawer(false);
            }
        });

        // Close on nav link click in mobile menu
        document.querySelectorAll(".mobile-nav-drawer a, .mobile-menu a").forEach(link => {
            link.addEventListener("click", () => toggleDrawer(false));
        });

        // Active page link highlighting
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".navbar a, .main-nav a, .mobile-nav-drawer a, .mobile-menu a").forEach(link => {
            const href = link.getAttribute("href");
            if (href) {
                const linkFile = href.split("/").pop().split("?")[0];
                if (linkFile === currentPath) {
                    link.classList.add("active");
                } else if (currentPath === "" && linkFile === "index.html") {
                    link.classList.add("active");
                }
            }
        });
    }


    /* =========================================================
       4. HOMEPAGE FEATURED PRODUCTS
    ========================================================= */

    function initFeaturedProducts() {
        const container = document.getElementById("featured-products");
        if (!container || typeof products === "undefined") return;

        container.innerHTML = "";
        const featured = products.slice(0, 4);

        featured.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";

            const isWish = AmoraStore.isInWishlist(product.id);
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

            // Card event listeners
            const wishBtn = card.querySelector(".wishlist-toggle-btn");
            wishBtn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                AmoraStore.toggleWishlist(product);
            });

            const quickAddBtn = card.querySelector(".btn-quick-add");
            quickAddBtn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                AmoraStore.addToCart(product, 1);
            });

            container.appendChild(card);
        });
    }


    /* =========================================================
       5. NEWSLETTER & COMMON INTERACTION LISTENERS
    ========================================================= */

    function initNewsletter() {
        const forms = document.querySelectorAll(".newsletter-form, .newsletter form");
        forms.forEach(form => {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                const emailInput = form.querySelector("input[type='email']");
                const email = emailInput ? emailInput.value.trim() : "";

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    AmoraToast.show({
                        title: "Invalid Email",
                        message: "Please provide a valid email address.",
                        type: "info"
                    });
                    if (emailInput) emailInput.focus();
                    return;
                }

                AmoraToast.show({
                    title: "Welcome to AMORA Club ",
                    message: "Check your inbox for 10% off your first luxury order."
                });
                form.reset();
            });
        });
    }

    // Smooth reveal animations on scroll
    function initScrollReveal() {
        const elements = document.querySelectorAll(".reveal-on-scroll");
        if (!elements.length || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }


    /* =========================================================
       6. GLOBAL INITIALIZATION
    ========================================================= */

    document.addEventListener("DOMContentLoaded", function () {
        AmoraStore.updateBadges();
        AmoraStore.updateWishlistButtons();
        initNavigation();
        initFeaturedProducts();
        initNewsletter();
        initScrollReveal();

        // Listen for multi-tab storage sync
        window.addEventListener("storage", function (e) {
            if (e.key === "amoraCart" || e.key === "amoraWishlist") {
                AmoraStore.updateBadges();
                AmoraStore.updateWishlistButtons();
            }
        });
    });

})();