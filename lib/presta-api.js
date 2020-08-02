const _PRESTA_URL_ = 'http://localhost:8080/api/';
const _PRESTA_API_KEY_ = 'BK91XIC85SE1TBHDSNWZD2MXXHMWBI4S';

export async function getProducts() {
    const results = await fetchAPI('products');
    return results;
}

async function fetchAPI(url, method = 'GET') {
    const response = await fetch(`${_PRESTA_URL_}${url}?output_format=JSON`, {
        method : method,
        headers : {
            'Authorization': 'Basic ' + Buffer.from(`${_PRESTA_API_KEY_}:${_PRESTA_API_KEY_}`).toString('base64')
        }
    });
    const results = await response.json();
    return results;
}
