import { products } from "./products.js";

const productSelect = document.getElementById("product-select");
const dealSelect = document.getElementById("deal-select");
const totalSpan = document.getElementById("total-amount");
const summaryText = document.getElementById("summary-text");
const qrBox = document.getElementById("qr-code");
const generateButton = document.getElementById("generate-qr");
const yearSpan = document.getElementById("year");

const TAX_RATE = 0.06;

function formatMoney(amount) {
    return `$${amount.toFixed(2)}`;
}

function populateProducts() {
    productSelect.innerHTML = '<option value="">Select a product</option>';
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} — ${formatMoney(product.price)}`;
        productSelect.appendChild(option);
    });
}

function getDealLabel(value) {
    if (value === "10off") return "10% off";
    if (value === "20off") return "20% off";
    if (value === "tax-exempt") return "Tax exempt";
    if (value === "free-item-tax-full") return "Free item, taxed at full price";
    if (value === "none") return "No discount";
    return "No discount";
}

function calculateTotals() {
    const productId = productSelect.value;
    const deal = dealSelect.value;

    if (!productId) {
        totalSpan.textContent = "$0.00";
        summaryText.textContent = "Select a product and deal to see the summary.";
        qrBox.innerHTML = "QR Code";
        return null;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return null;

    let basePrice = product.price;
    let discount = 0;
    let taxableAmount = basePrice;

    if (deal === "10off") {
        discount = basePrice * 0.1;
        taxableAmount = basePrice - discount;
    } else if (deal === "20off") {
        discount = basePrice * 0.2;
        taxableAmount = basePrice - discount;
    } else if (deal === "tax-exempt") {
        discount = 0;
        taxableAmount = 0;
    } else if (deal === "free-item-tax-full") {
        discount = basePrice;
        taxableAmount = basePrice;
    } else {
        discount = 0;
        taxableAmount = basePrice;
    }

    let tax = taxableAmount * TAX_RATE;
    if (deal === "tax-exempt") {
        tax = 0;
    }

    const total = Math.max(0, basePrice - discount + tax);

    totalSpan.textContent = formatMoney(total);

    const dealLabel = getDealLabel(deal);
    summaryText.textContent = `${product.name} with ${dealLabel}. Base price: ${formatMoney(basePrice)}, discount: ${formatMoney(discount)}, tax: ${formatMoney(tax)}, total: ${formatMoney(total)}.`;

    return {
        product,
        deal,
        basePrice,
        discount,
        tax,
        total
    };
}

function generateQrCode() {
    const result = calculateTotals();
    if (!result) return;

    qrBox.innerHTML = "";

    const qrData = {
        product: result.product.name,
        deal: getDealLabel(result.deal),
        total: result.total.toFixed(2)
    };

    new QRCode(qrBox, {
        text: JSON.stringify(qrData),
        width: 200,
        height: 200
    });
}

function setYear() {
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

populateProducts();
setYear();
calculateTotals();

productSelect.addEventListener("change", calculateTotals);
dealSelect.addEventListener("change", calculateTotals);
generateButton.addEventListener("click", generateQrCode);
