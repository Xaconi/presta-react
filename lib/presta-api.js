// Libs
import cookie from 'js-cookie';
import { parseCookies } from './cookies';

// API data
const _PRESTA_URL_ = 'http://localhost:8080/api/';
const _PRESTA_API_KEY_ = 'BK91XIC85SE1TBHDSNWZD2MXXHMWBI4S';

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

export async function initSession(request) {
    // Init basic Presta params
    const cookies = parseCookies(request);
    const idCart = cookies.idCart;

    // User


    // Cart
    if(idCart == null || idCart == 'undefined')
        initCart();
}

async function initCart() {
    console.log("INIT CART");
    const results = await postAPI('carts',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <cart>
                <id_currency>${__PRESTA_CURRENCY__}</id_currency>
                <id_lang>${__PRESTA_LANG__}</id_lang>
            </cart>
        </prestashop>`
    );

    cookie.set("idCart", results.cart.id);
}

export function addProduct(idProduct, idProductAttribute = 0) {
    console.log(`ADD PRODUCT ${idProduct}`);
}
