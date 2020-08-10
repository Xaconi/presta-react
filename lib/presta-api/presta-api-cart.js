// Presta-API
import { fetchAPI, postAPI, putAPI, prestaEvents } from './presta-api';
import { __PRESTA_CURRENCY__, __PRESTA_LANG__ } from './presta-api';
import { user } from './presta-api-user';

// Libs
import cookie from 'js-cookie';

// Local params
let cart;

export async function initCart() {
    let userCart = "";
    if(user.id_customer != "")
        userCart = `<id_customer>${user.id_customer}</id_customer>`;
    else if(user.id != "")
        userCart = `<id_guest>${user.id}</id_guest>`;

    // We create the cart with the Presta WS...
    const results = await postAPI('carts',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <cart>
                <id_currency>${__PRESTA_CURRENCY__}</id_currency>
                <id_lang>${__PRESTA_LANG__}</id_lang>
                ${userCart}
            </cart>
        </prestashop>`
    );

    // ...and we persist that cart on a state cookie
    updateCartState(results.cart);
}

export async function loadCart() {
    // We recover the cart from the state cookie
    cart = JSON.parse(window.atob(cookie.get('cart')));
    updateCartState(cart);
}

export async function addProduct(idProduct, idProductAttribute = 0, quantity = 1) {
    console.log(`ADD PRODUCT ${idProduct}`);

    let userCart = "";
    if(user.id_customer != "")
        userCart = `<id_customer>${user.id_customer}</id_customer>`;
    else if(user.id != "")
        userCart = `<id_guest>${user.id}</id_guest>`;

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
                ${userCart}
                <associations>
                    <cart_rows>
                        ${cartRows}
                    </cart_rows>
                </associations>
            </cart>
        </prestashop>`
    );

    updateCartState(results.cart);
}

export async function removeProductFromCart(idProduct, idProductAttribute) {
    console.log(`REMOVE PRODUCT ${idProduct} FROM CART`);

    let userCart = "";
    if(user.id_customer != "")
        userCart = `<id_customer>${user.id_customer}</id_customer>`;
    else if(user.id != "")
        userCart = `<id_guest>${user.id}</id_guest>`;

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
                ${userCart}
                <associations>
                    <cart_rows>
                        ${cartRows}
                    </cart_rows>
                </associations>
            </cart>
        </prestashop>`
    );

    updateCartState(results.cart);
}

function updateCartState(newCart) {
    cart = newCart;
    prestaEvents.emit('updateCart', cart);
    cookie.set("cart", window.btoa(JSON.stringify(newCart)));
}
