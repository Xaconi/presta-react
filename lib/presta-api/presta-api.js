// Libs
import { parseCookies } from '../cookies';
import EventEmitter  from 'events';

// Presta-API
import { loadCart, initCart } from './presta-api-cart';
import { loadUser, initUser } from './presta-api-user';

// API data
const _PRESTA_URL_ = 'http://localhost:8080/api/';
const _PRESTA_API_KEY_ = 'BK91XIC85SE1TBHDSNWZD2MXXHMWBI4S';

// Local params
let cart, user;

export let prestaEvents;
prestaEvents = new EventEmitter();

// Temp params (we'll get these from the shop later...)
export const __PRESTA_CURRENCY__ = 1;
export const __PRESTA_LANG__ = 1;

export async function getProducts() {
    const results = await fetchAPI('products');
    return results;
}

export async function fetchAPI(url) {
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

export async function postAPI(url, body) {
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

export async function putAPI(url, body) {
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
    const cookieUser = cookies.user;
    const cookieCart = cookies.cart;

    // User
    if(cookieUser == null || cookieUser == 'undefined')
        await initUser();
    else
        await loadUser();

    // Cart
    if(cookieCart == null || cookieCart == 'undefined')
        await initCart();
    else
        await loadCart();
}
