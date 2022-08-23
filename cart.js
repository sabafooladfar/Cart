import {
    productsBoxes
} from "./products.js";

let cart = [];

const cartIcon = document.querySelector(".fa-cart-shopping");
const backDrop = document.querySelector(".backdrop");
const cartBox = document.querySelector(".cartt");
const closeIcon = document.querySelector(".fa-xmark");
const boxes = document.querySelector(".boxes");
const cartBadge = document.querySelector(".cart-badge");
const totalPrice = document.querySelector(".total");
const cartItems = document.querySelector(".cart-items");
const clearCart = document.querySelector(".clear-cart");

cartIcon.addEventListener("click", showCart);
closeIcon.addEventListener("click", closeCart);
backDrop.addEventListener("click", closeCart);

function showCart() {
    backDrop.style.display = "block";
    cartBox.style.top = "20%";
}

function closeCart() {
    cartBox.style.top = "-100%";
    backDrop.style.display = "none";
}

let btnsDOM = [];

class Products {
    getProducts() {
        return productsBoxes;
    };
}
class Ui {
    showProducts(product) {
        let result = "";
        product.forEach(item => {
            result += `
            <div class="card col-lg-4 -12 col-md-6 m-5 m-lg-4" style="width: 18rem;">
                <img src=${item.image}
                    class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.price} $</p>
                    <div class="btn btn-primary add-btn" data-id = ${item.id}>Add To Cart</div>
                </div>
            </div>
            `;
            boxes.innerHTML = result;
        });
    }
    getAddToCartBtn() {
        const addToCartBtn = document.querySelectorAll(".add-btn");
        btnsDOM = [...addToCartBtn];
        const btns = [...addToCartBtn];
        btns.forEach((btn) => {
            const btnId = btn.dataset.id;
            const isInCart = cart.find((p) => p.id == btnId);
            if (isInCart) {
                btn.innerText = "Added !";
                btn.disabled = true;
            }
            btn.addEventListener("click", (e) => {
                // console.log(e.target);
                e.target.innerText = "Added !";
                e.target.disabled = true;
                const addedProducts = {
                    ...Storage.getProduct(btnId),
                    quantity: 1
                };
                cart = [...cart, addedProducts];
                Storage.saveCart(cart);
                this.setCartValue(cart);
                this.addCartItems(addedProducts);
            })
        })
    }
    setCartValue(cart) {
        let numCartItems = 0;
        const totalCartPrice = cart.reduce((acc, curr) => {
            numCartItems += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        totalPrice.innerHTML = `<h6> Total Price : ${totalCartPrice} $ </h6>`;
        cartBadge.innerText = numCartItems;
    }
    addCartItems(items) {
        const cartDiv = document.createElement("div");
        cartDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center row detail">
        <img class="cart-img col-2"
            src=${items.image}
            alt="">
        <div class="col-2 d-flex flex-column justify-content-center">
            <p class="title">${items.title}</p>
            <p class="price">${items.price}$</p>
        </div>
        <div class="more-less-box col-2">
            <i class="fa-solid fa-angle-up" data-id=${items.id}></i>
            <p>${items.quantity}</p>
            <i class="fa-solid fa-angle-down" data-id=${items.id}></i>
        </div>
        <div class="d-flex justify-content-center col-2">
            <i class="fa-solid fa-trash fa-lg" data-id=${items.id}></i>
        </div>
    </div>
        `;
        cartItems.appendChild(cartDiv);
    }
    setupApp() {
        cart = Storage.getCart() || [];
        cart.forEach((item) =>
            this.addCartItems(item));
        this.setCartValue(cart);
    }
    cartLogic() {
        clearCart.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearCart();
        })
        cartItems.addEventListener("click", (e) => {
            if (e.target.classList.contains("fa-angle-up")) {
                const add = e.target;
                const added = cart.find((cItem) =>
                    cItem.id == add.dataset.id
                );
                console.log(added);
                added.quantity++;
                Storage.saveCart(cart);
                this.setCartValue(cart);
                add.nextElementSibling.innerText = added.quantity;
            } else if (e.target.classList.contains("fa-angle-down")) {
                const sub = e.target;
                const subbed = cart.find((cItem) =>
                    cItem.id == sub.dataset.id
                );
                if(subbed.quantity === 1){
                    this.removeItem(subbed.id);
                    cartItems.removeChild(sub.parentElement.parentElement.parentElement);
                    return;
                }
                subbed.quantity--;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                sub.previousElementSibling.innerText = subbed.quantity;
            } else if(e.target.classList.contains("fa-trash")){
                const deleteItem = e.target;
                const deletedItem = cart.find((cItem) =>
                cItem.id == deleteItem.dataset.id
            );
            this.removeItem(deletedItem.id);
            Storage.saveCart(cart);
            cartItems.removeChild(deleteItem.parentElement.parentElement.parentElement);
            }
        });
    }

    clearCart() {
        cart.forEach(cItem => this.removeItem(cItem.id));
        while (cartItems.children.length) {
            cartItems.removeChild(cartItems.children[0]);
        }
        closeCart();
    }
    removeItem(id) {
        cart = cart.filter(cItem => cItem.id !== id)
        this.setCartValue(cart);
        Storage.saveCart(cart);
        const buttons = btnsDOM.find((btn) => btn.dataset.id == id);
        buttons.innerText = "Add To Cart";
        buttons.disabled = false;
    }
}

class Storage {
    static saveProducts(product) {
        localStorage.setItem("products", JSON.stringify(product));
    }
    static getProduct(id) {
        const _product = JSON.parse(localStorage.getItem("products"));
        return (_product.find((p) => p.id == id));
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const product = new Products();
    const productsBoxes = product.getProducts();
    const ui = new Ui();
    ui.setupApp();
    ui.showProducts(productsBoxes);
    ui.getAddToCartBtn();
    ui.cartLogic();
    Storage.saveProducts(productsBoxes);
})