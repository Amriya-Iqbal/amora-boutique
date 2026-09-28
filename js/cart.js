/* =========================================================
   AMORA BOUTIQUE - SHOPPING BAG (CART) CONTROLLER
========================================================= */

(function () {
    "use strict";

    let appliedDiscountPercent = 0;
    let appliedDiscountFixed = 0;
    let appliedPromoCode = "";

    function renderCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        const emptyCartSection = document.getElementById("empty-cart");
        const cartContentSection = document.getElementById("cart-content");

        const subtotalEl = document.getElementById("cart-subtotal");
        const shippingEl = document.getElementById("cart-shipping");
        const discountRowEl = document.getElementById("cart-discount-row");
        const discountEl = document.getElementById("cart-discount");
        const totalEl = document.getElementById("cart-total");

        const shippingMeterText = document.getElementById("shipping-meter-text");
        const shippingMeterFill = document.getElementById("shipping-meter-fill");

        if (!cartItemsContainer) return;

        const cart = window.AmoraStore ? window.AmoraStore.getCart() : [];

        if (cart.length === 0) {
            if (emptyCartSection) emptyCartSection.style.display = "block";
            if (cartContentSection) cartContentSection.style.display = "none";
            return;
        }

        if (emptyCartSection) emptyCartSection.style.display = "none";
        if (cartContentSection) cartContentSection.style.display = "grid";

        cartItemsContainer.innerHTML = "";
        let subtotal = 0;

        cart.forEach(item => {
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.quantity) || 1;
            const lineTotal = itemPrice * itemQty;
            subtotal += lineTotal;

            const row = document.createElement("article");
            row.className = "cart-item-row";

            row.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-meta">
                    <span class="eyebrow" style="font-size: 10px; margin-bottom: 4px;">${item.category || "Couture"}</span>
                    <h4><a href="product.html?id=${item.id}">${item.name}</a></h4>
                    <p class="variants">
                        <span>Size: <b>${item.size || "Standard"}</b></span> | 
                        <span>Color: <b>${item.color || "Default"}</b></span>
                    </p>
                    <div class="price">$${itemPrice.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions-col">
                    <div class="qty-stepper">
                        <button type="button" class="btn-cart-minus" aria-label="Decrease quantity">−</button>
                        <input type="text" value="${itemQty}" readonly>
                        <button type="button" class="btn-cart-plus" aria-label="Increase quantity">+</button>
                    </div>
                    <div style="font-weight: 700; color: var(--color-dark); font-size: 15px;">
                        $${lineTotal.toFixed(2)}
                    </div>
                    <button type="button" class="btn-remove-item">
                        <i class="fa-regular fa-trash-can"></i> Remove
                    </button>
                </div>
            `;

            // Decrease quantity
            row.querySelector(".btn-cart-minus").addEventListener("click", () => {
                if (window.AmoraStore) {
                    window.AmoraStore.updateCartQuantity(item.id, item.size, item.color, -1);
                    renderCart();
                }
            });

            // Increase quantity
            row.querySelector(".btn-cart-plus").addEventListener("click", () => {
                if (window.AmoraStore) {
                    window.AmoraStore.updateCartQuantity(item.id, item.size, item.color, 1);
                    renderCart();
                }
            });

            // Remove item
            row.querySelector(".btn-remove-item").addEventListener("click", () => {
                if (window.AmoraStore) {
                    window.AmoraStore.removeFromCart(item.id, item.size, item.color);
                    renderCart();
                }
            });

            cartItemsContainer.appendChild(row);
        });

        // Shipping calculation ($100 free shipping threshold)
        const freeShippingThreshold = 100;
        const isFreeShipping = subtotal >= freeShippingThreshold;
        const shippingCost = isFreeShipping ? 0 : 8;

        if (shippingMeterFill && shippingMeterText) {
            if (isFreeShipping) {
                shippingMeterFill.style.width = "100%";
                shippingMeterFill.style.backgroundColor = "var(--color-success)";
                shippingMeterText.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> <b>Congratulations!</b> You've unlocked Complimentary Shipping.`;
            } else {
                const diff = (freeShippingThreshold - subtotal).toFixed(2);
                const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
                shippingMeterFill.style.width = `${percent}%`;
                shippingMeterFill.style.backgroundColor = "var(--color-rose)";
                shippingMeterText.innerHTML = `Add <b>$${diff}</b> more to unlock <b>Complimentary Shipping</b>`;
            }
        }

        // Discounts
        let discountAmount = 0;
        if (appliedDiscountPercent > 0) {
            discountAmount = subtotal * (appliedDiscountPercent / 100);
        } else if (appliedDiscountFixed > 0) {
            discountAmount = Math.min(subtotal, appliedDiscountFixed);
        }

        const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = shippingCost === 0 ? "COMPLIMENTARY" : `$${shippingCost.toFixed(2)}`;

        if (discountRowEl && discountEl) {
            if (discountAmount > 0) {
                discountRowEl.style.display = "flex";
                discountEl.textContent = `-$${discountAmount.toFixed(2)} (${appliedPromoCode})`;
            } else {
                discountRowEl.style.display = "none";
            }
        }

        if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)}`;
    }

    function setupPromoCode() {
        const promoForm = document.getElementById("promo-form");
        const promoInput = document.getElementById("promo-code-input");
        const promoFeedback = document.getElementById("promo-feedback");

        if (!promoForm || !promoInput) return;

        promoForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const code = promoInput.value.trim().toUpperCase();

            if (!code) return;

            if (code === "AMORA10") {
                appliedDiscountPercent = 10;
                appliedDiscountFixed = 0;
                appliedPromoCode = "AMORA10";
                if (promoFeedback) {
                    promoFeedback.style.color = "var(--color-success)";
                    promoFeedback.textContent = "✓ 10% Luxury discount applied!";
                }
                renderCart();
            } else if (code === "WELCOME") {
                appliedDiscountPercent = 0;
                appliedDiscountFixed = 15;
                appliedPromoCode = "WELCOME";
                if (promoFeedback) {
                    promoFeedback.style.color = "var(--color-success)";
                    promoFeedback.textContent = "✓ $15 VIP Welcome credit applied!";
                }
                renderCart();
            } else {
                if (promoFeedback) {
                    promoFeedback.style.color = "var(--color-danger)";
                    promoFeedback.textContent = "✕ Invalid promo code. Try AMORA10 or WELCOME.";
                }
            }
        });
    }

    function setupCheckoutModal() {
        const btnCheckout = document.getElementById("btn-checkout");
        const modalOverlay = document.getElementById("checkout-modal-overlay");
        const btnCloseModal = document.getElementById("close-modal-btn");
        const checkoutForm = document.getElementById("checkout-demo-form");

        if (btnCheckout && modalOverlay) {
            btnCheckout.addEventListener("click", function () {
                const cart = window.AmoraStore ? window.AmoraStore.getCart() : [];
                if (cart.length === 0) {
                    if (window.AmoraToast) {
                        window.AmoraToast.show({ title: "Bag is Empty", message: "Add pieces to proceed to checkout.", type: "info" });
                    }
                    return;
                }
                modalOverlay.classList.add("is-active");
            });

            if (btnCloseModal) {
                btnCloseModal.addEventListener("click", () => modalOverlay.classList.remove("is-active"));
            }

            modalOverlay.addEventListener("click", e => {
                if (e.target === modalOverlay) modalOverlay.classList.remove("is-active");
            });

            if (checkoutForm) {
                checkoutForm.addEventListener("submit", function (e) {
                    e.preventDefault();
                    modalOverlay.classList.remove("is-active");
                    if (window.AmoraStore) {
                        window.AmoraStore.saveCart([]);
                    }
                    renderCart();

                    if (window.AmoraToast) {
                        window.AmoraToast.show({
                            title: "Order Placed Successfully! ",
                            message: "Thank you for shopping with AMORA BOUTIQUE. Your order confirmation has been emailed.",
                            actionText: "Continue Shopping",
                            actionUrl: "shop.html"
                        });
                    }
                });
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderCart();
        setupPromoCode();
        setupCheckoutModal();

        // Listen for updates from other tabs
        window.addEventListener("amora:cartUpdated", renderCart);
    });

})();