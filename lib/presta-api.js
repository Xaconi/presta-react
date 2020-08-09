// Libs
import cookie from 'js-cookie';
import { parseCookies } from './cookies';

// API data
const _PRESTA_URL_ = 'http://localhost:8080/api/';
const _PRESTA_API_KEY_ = 'BK91XIC85SE1TBHDSNWZD2MXXHMWBI4S';

// Local params
let cart;

// Temp params (we'll get these from the shop later...)
const __PRESTA_CURRENCY__ = 1;
const __PRESTA_LANG__ = 1;

export async function getProducts() {
    const results = await fetchAPI('products');
    return results;
}

async function fetchAPI(url) {
    const response = await fetch(`${_PRESTA_URL_}${url}?output_format=JSON`, {
        method : 'GET',
        headers : {
            'Authorization': 'Basic ' + Buffer.from(`${_PRESTA_API_KEY_}:${_PRESTA_API_KEY_}`).toString('base64'),
            'Content-Type' : 'application/json'
        },
        mode : 'no-cors'
    });

    const results = await response.json();
    return results;
}

async function postAPI(url, body) {
    const response = await fetch(`${_PRESTA_URL_}${url}?output_format=JSON&ws_key=${_PRESTA_API_KEY_}`, {
        method : 'POST',
        headers : new Headers({
            'Content-Type' : 'application/json'
        }),
        body : body
    });

    const results = await response.json();
    return results;
}

async function putAPI(url, body) {
    const response = await fetch(`${_PRESTA_URL_}${url}?output_format=JSON&ws_key=${_PRESTA_API_KEY_}`, {
        method : 'PUT',
        headers : new Headers({
            'Content-Type' : 'application/json'
        }),
        body : body
    });

    const results = await response.json();
    return results;
}

export async function initSession(request) {
    // Init basic Presta params
    const cookies = parseCookies(request);
    const cookieCart = cookies.cart;

    // Cart
    if(cookieCart == null || cookieCart == 'undefined')
        initCart();
    else
        loadCart();
}

async function initCart() {
    console.log("INIT CART");

    // We create the cart with the Presta WS...
    const results = await postAPI('carts',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <cart>
                <id_currency>${__PRESTA_CURRENCY__}</id_currency>
                <id_lang>${__PRESTA_LANG__}</id_lang>
            </cart>
        </prestashop>`
    );

    // ...and we persist that cart on a state cookie
    updateCartState(results.cart);
}

async function loadCart() {
    console.log("LOAD CART");

    // We recover the cart from the state cookie
    cart = JSON.parse(window.atob(cookie.get('cart')));
}

export async function addProduct(idProduct, idProductAttribute = 0, quantity = 1) {
    console.log(`ADD PRODUCT ${idProduct}`);

    let cartRows = '';
    let productOnCart = false;
    cart?.associations?.cart_rows.forEach(function(element, index){
        if(element.id_product == idProduct && element.id_product_attribute == idProductAttribute) {
            cartRows += `<cart_row>
                <id_product>${element.id_product}</id_product>
                <id_product_attribute>${element.id_product_attribute}</id_product_attribute>
                <id_address_delivery>${element.id_address_delivery}</id_address_delivery>
                <id_customization>${element.id_customization}</id_customization>
                <quantity>${(parseInt(element.quantity) + parseInt(quantity))}</quantity>
            </cart_row>`;

            productOnCart = true;
        } else {
            cartRows += `<cart_row>
                <id_product>${element.id_product}</id_product>
                <id_product_attribute>${element.id_product_attribute}</id_product_attribute>
                <id_address_delivery>${element.id_address_delivery}</id_address_delivery>
                <id_customization>${element.id_customization}</id_customization>
                <quantity>${element.quantity}</quantity>
            </cart_row>`;
        }
    });

    if(!productOnCart) {
        cartRows += `<cart_row>
            <id_product>${idProduct}</id_product>
            <id_product_attribute>${idProductAttribute}</id_product_attribute>
            <id_address_delivery>0</id_address_delivery>
            <id_customization>0</id_customization>
            <quantity>${quantity}</quantity>
        </cart_row>`
    }

    // Update cart on Presta's Webservice
    const results = await putAPI('carts',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <cart>
                <id>${cart.id}</id>
                <id_currency>${__PRESTA_CURRENCY__}</id_currency>
                <id_lang>${__PRESTA_LANG__}</id_lang>
                <associations>
                    <cart_rows>
                        ${cartRows}
                    </cart_rows>
                </associations>
            </cart>
        </prestashop>`
    );

    updateCartState(results.cart);
    console.log(results.cart);
}

export async function removeProductFromCart(idProduct, idProductAttribute) {
    console.log(`REMOVE PRODUCT ${idProduct} FROM CART`);

    let cartRows = '';
    cart?.associations?.cart_rows.forEach(function(element, index){
        if(element.id_product != idProduct && element.id_product_attribute != idProductAttribute) {
            cartRows += `<cart_row>
                <id_product>${element.id_product}</id_product>
                <id_product_attribute>${element.id_product_attribute}</id_product_attribute>
                <id_address_delivery>${element.id_address_delivery}</id_address_delivery>
                <id_customization>${element.id_customization}</id_customization>
                <quantity>${element.quantity}</quantity>
            </cart_row>`;
        }
    });

    // Update cart on Presta's Webservice
    const results = await putAPI('carts',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <cart>
                <id>${cart.id}</id>
                <id_currency>${__PRESTA_CURRENCY__}</id_currency>
                <id_lang>${__PRESTA_LANG__}</id_lang>
                <associations>
                    <cart_rows>
                        ${cartRows}
                    </cart_rows>
                </associations>
            </cart>
        </prestashop>`
    );

    updateCartState(results.cart);
    console.log(results.cart);
}

function updateCartState(newCart) {
    cart = newCart;
    cookie.set("cart", window.btoa(JSON.stringify(newCart)));
}
