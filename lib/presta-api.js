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
            'Authorization': 'Basic ' + Buffer.from(`${_PRESTA_API_KEY_}:${_PRESTA_API_KEY_}`).toString('base64')
        }
    });

    const results = await response.json();
    return results;
}

async function postAPI(url, body) {
    const response = await fetch(`${_PRESTA_URL_}${url}?output_format=JSON`, {
        method : 'POST',
        headers : {
            'Authorization': 'Basic ' + Buffer.from(`${_PRESTA_API_KEY_}:${_PRESTA_API_KEY_}`).toString('base64')
        },
        body : body
    });

    const results = await response.json();
    return results;
}

export async function initSession() {
    // Init basic Presta params

    // User


    // Cart
    createCart();
}

async function createCart() {
    const results = await postAPI('carts',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <cart>
                <id></id>
                <id_address_delivery></id_address_delivery>
                <id_address_invoice></id_address_invoice>
                <id_currency>${__PRESTA_CURRENCY__}</id_currency>
                <id_customer></id_customer>
                <id_guest></id_guest>
                <id_lang>${__PRESTA_LANG__}</id_lang>
                <id_shop_group></id_shop_group>
                <id_shop></id_shop>
                <id_carrier></id_carrier>
                <recyclable></recyclable>
                <gift></gift>
                <gift_message></gift_message>
                <mobile_theme></mobile_theme>
                <delivery_option></delivery_option>
                <secure_key></secure_key>
                <allow_seperated_package></allow_seperated_package>
                <date_add></date_add>
                <date_upd></date_upd>
                <associations>
                    <cart_rows>
                        <cart_row>
                            <id_product></id_product>
                            <id_product_attribute></id_product_attribute>
                            <id_address_delivery></id_address_delivery>
                            <id_customization></id_customization>
                            <quantity></quantity>
                        </cart_row>
                    </cart_rows>
                </associations>
            </cart>
        </prestashop>`
    );
}
