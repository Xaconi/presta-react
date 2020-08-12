import { fetchAPI, putAPI, postAPI } from './presta-api';
import { getTaxRuleGroups } from './presta-api-tax';

export async function getProduct(idProduct, idProductAttribute = 0) {
    const response = await fetchAPI(`products/${idProduct}`, `price[price_wt][use_tax]=1&price[price_wt][product_attribute]=${idProductAttribute}`);
    // const tax = await getTaxRuleGroups(response.product.id_tax_rules_group);
    return response.product;
}
