async function getCategoriesData() {
    const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
    const data = await response.json();
    return data.categories;
}

function displayProducts(products) {
    const productContainer = document.querySelector('.products-container');
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        let discountInfo = '';
        if (product.compare_at_price && product.price < product.compare_at_price) {
            const percentOff = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
            discountInfo = `<p>${percentOff}% off</p>`;
        }
        let productBadge = product.badge_text || '';
        productCard.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.title}" />
            <div class="product-info">
                <div class="product-title">${product.title}</div> <div class="separator"></div> <div class="vendor">${product.vendor}</div>
            </div>
            <div class="price-container">
                <div class="compare-price">Rs: ${product.price}.00</div>
                <div class="compare-at-price">${product.compare_at_price}.00</div>
                <div class="discount">${discountInfo}</div>
            </div>
            <button class="add-to-cart">Add to cart</button>
        `;
        if (productBadge) {
            productCard.innerHTML += `<div class="product-badge">${productBadge}</div>`;
        }
        productContainer.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const tabsContainer = document.querySelector('.tabs-container');
    const categories = await getCategoriesData();
    let activeTab = null;

    categories.forEach((category, index) => {
        const tab = document.createElement('button');
        tab.textContent = category.category_name;
        tab.dataset.categoryIndex = index;

        if (index === 0) {
            tab.classList.add('active');
            activeTab = tab;
            displayProducts(category.category_products);
        }

        tab.addEventListener('click', function() {
            if (activeTab) {
                activeTab.classList.remove('active');
            }
            tab.classList.add('active');
            activeTab = tab;
            const categoryIndex = this.dataset.categoryIndex;
            displayProducts(categories[categoryIndex].category_products);
        });

        tabsContainer.appendChild(tab);
    });
});