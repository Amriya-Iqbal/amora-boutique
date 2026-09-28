/* =========================================================
   AMORA BOUTIQUE - LUXURY PRODUCTS DATASET
========================================================= */

const products = [
    {
        id: 1,
        name: "Rosé Satin Slip Dress",
        category: "dresses",
        price: 89,
        originalPrice: 115,
        rating: 4.9,
        reviewsCount: 38,
        badge: "Bestseller",
        isNew: false,
        image: "images/Satin-Slip-Dress.png",
        gallery: [
            "images/Satin-Slip-Dress1.png",
            "images/Satin-Slip-Dress1.png",
           "images/Satin-Slip-Dress2.png",
        ],
        description: "A breathtaking bias-cut satin slip dress featuring a fluid drape, subtle cowl neckline, and delicate adjustable straps for an effortless evening glow.",
        details: "Crafted from heavy 19mm silk-feel satin that gracefully skims the silhouette without clinging. Finished with a side slit and French seams.",
        fabric: "97% Satin Poly, 3% Elastane",
        care: "Dry clean or delicate hand wash cold. Steam on low heat.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Rose", "Ivory", "Champagne"]
    },
    {
        id: 2,
        name: "Classic Silk-Touch Blouse",
        category: "tops",
        price: 59,
        originalPrice: 75,
        rating: 4.8,
        reviewsCount: 26,
        badge: "New",
        isNew: true,
        image: "images/classic.jpeg",
        gallery: [
            "images/classic.jpeg",
            "images/classic.jpeg"
        ],
        description: "A tailored button-down blouse with refined concealed placket and mother-of-pearl accents. A cornerstone of capsule wardrobe elegance.",
        details: "Features relaxed tailored shoulders, elongated French cuffs, and a soft rounded hem designed to be tucked or worn loose.",
        fabric: "100% Breathable Silk-Touch Viscose",
        care: "Machine wash delicate cycle in mesh laundry bag. Hang dry.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blush", "Pure White", "Dusty Rose"]
    },
    {
        id: 3,
        name: "Pleated Linen-Blend Midi Dress",
        category: "dresses",
        price: 95,
        originalPrice: 128,
        rating: 5.0,
        reviewsCount: 42,
        badge: "Trending",
        isNew: false,
        image: "images/pleated.png",
        gallery: [
            "images/pleated.png",
            "images/pleated1.png"
        ],
        description: "Artfully pleated bodice meets an airy A-line skirt. Designed with discreet side pockets and a self-tie belt to cinch the waist.",
        details: "Fully lined with breathable cotton voile. Concealed back zipper with hook-and-eye closure.",
        fabric: "70% French Flax Linen, 30% Mulberry Silk",
        care: "Gentle machine wash inside out. Warm iron while slightly damp.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blush Pink", "Onyx Black", "Sage Mist"]
    },
    {
        id: 4,
        name: "Cashmere-Touch Ribbed Cardigan",
        category: "tops",
        price: 65,
        originalPrice: 85,
        rating: 4.7,
        reviewsCount: 19,
        badge: null,
        isNew: false,
        image: "images/cashmere.png",
        gallery: [
            "images/cashmere.png",
            "images/cashmere1.png"
        ],
        description: "An ultra-plush ribbed knit cardigan with tortoiseshell buttons and dropped shoulders for an effortless, cozy drape.",
        details: "Subtle balloon sleeves, deep V-neckline, and ribbed hemline that sits comfortably at the hip.",
        fabric: "50% Fine Merino Wool, 50% Organic Cotton",
        care: "Hand wash cold with wool detergent. Dry flat away from direct heat.",
        sizes: ["S", "M", "L"],
        colors: ["Cream", "Soft Beige", "Warm Oatmeal"]
    },
    {
        id: 5,
        name: "Tailored Palazzo Wide-Leg Trousers",
        category: "bottoms",
        price: 72,
        originalPrice: 94,
        rating: 4.9,
        reviewsCount: 31,
        badge: "Bestseller",
        isNew: false,
        image: "images/plazzo.jpeg",
        gallery: [
            "images/plazzo1.jpeg",
            "images/plazzo2.jpeg"
        ],
        description: "High-waisted trousers tailored with front knife pleats and an architectural wide leg for an elongated, statuesque silhouette.",
        details: "Internal waistband grip, slanted hip pockets, welt back pockets, and double hook-and-bar closure.",
        fabric: "65% Recycled Polyester, 33% Rayon, 2% Spandex",
        care: "Machine wash cold with similar colors. Line dry and light steam.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Cream", "Classic Black", "Taupe"]
    },
    {
        id: 6,
        name: "Baroque Freshwater Pearl Pendant",
        category: "accessories",
        price: 45,
        originalPrice: 60,
        rating: 4.9,
        reviewsCount: 54,
        badge: "New",
        isNew: true,
        image: "images/accessories.jpeg",
        gallery: [
            "images/accessories.jpeg",
            "images/accessories1.jpeg"
        ],
        description: "An authentic baroque cultured pearl suspended from an 18K gold vermeil rolo chain with an adjustable lobster clasp.",
        details: "Every organic pearl is naturally unique. Length: 18 inches with a 2-inch extension chain.",
        fabric: "18K Gold Vermeil over 925 Sterling Silver & Natural Pearl",
        care: "Wipe clean with a soft microfiber cloth. Avoid perfumes and lotions.",
        sizes: ["One Size"],
        colors: ["Gold & Pearl"]
    },
    {
        id: 7,
        name: "Midnight Silk Gala Gown",
        category: "dresses",
        price: 120,
        originalPrice: 165,
        rating: 5.0,
        reviewsCount: 18,
        badge: "Luxury",
        isNew: false,
        image: "images/gala.png",
        gallery: [
            "images/gala.png",
            "images/gala1.png"
        ],
        description: "An awe-inspiring evening gown featuring a sculpted asymmetric neckline and cascading column skirt that catches every light.",
        details: "Built-in corset boning for tailored bust support and a sweeping floor-length hem with dramatic movement.",
        fabric: "100% Pure Mulberry Silk Charmeuse",
        care: "Specialist dry clean only.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Burgundy", "Navy"]
    },
    {
        id: 8,
        name: "Sculptural Leather Shoulder Bag",
        category: "accessories",
        price: 78,
        originalPrice: 105,
        rating: 4.8,
        reviewsCount: 33,
        badge: "Trending",
        isNew: false,
        image: "images/bag.png",
        gallery: [
            "images/bag.png",
            "images/bag1.png"
        ],
        description: "Clean geometric curves define this compact shoulder bag, crafted from supple full-grain vegan leather with gold-toned brass hardware.",
        details: "Magnetic snap closure, microsuede-lined interior with zipped security pocket. Detachable crossbody strap included.",
        fabric: "Premium Italian Vegan Nappa Leather",
        care: "Clean with a damp cloth. Store in the complimentary Amora dustbag.",
        sizes: ["One Size"],
        colors: ["Warm Cream", "Noir Black", "Chestnut"]
    },
    {
        id: 9,
        name: "Pleated Satin Midi Skirt",
        category: "bottoms",
        price: 68,
        originalPrice: 88,
        rating: 4.8,
        reviewsCount: 22,
        badge: "New",
        isNew: true,
        image: "images/skirt.png",
        gallery: [
            "images/skirt.png",
            "images/skirt.png"
        ],
        description: "Knife-pleated satin skirt that swishes with graceful motion. Styled effortlessly with knitwear or a tailored silk camisole.",
        details: "Encased elastic waistband for invisible all-day comfort. Midi length hitting midway down the calf.",
        fabric: "100% Lightweight Lustrous Polyester",
        care: "Hand wash cold. Do not iron pleats; hang to maintain structure.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Champagne", "Black", "Rose Bronze"]
    },
    {
        id: 10,
        name: "Luxe Draped Cowl-Neck Top",
        category: "tops",
        price: 52,
        originalPrice: 68,
        rating: 4.7,
        reviewsCount: 17,
        badge: null,
        isNew: false,
        image: "images/cowl.png",
        gallery: [
            "images/cowl.png",
        ],
        description: "A liquid-like cowl neck that catches candlelight exquisitely. Perfect for date night styling or layered underneath a tailored blazer.",
        details: "Double-layered front bodice prevents transparency. Raw-cut laser edge hem.",
        fabric: "95% Micro-Modal, 5% Spandex",
        care: "Machine wash cold inside out on gentle cycle.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Ivory", "Terracotta", "Black"]
    }
];