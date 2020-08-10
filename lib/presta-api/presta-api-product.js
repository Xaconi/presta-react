import { fetchAPI, putAPI, postAPI } from './presta-api';

export async function getProduct(idProduct, idProductAttribute = 0) {
    const response = await fetchAPI(`products/${idProduct}`);
    return response.product;
}
