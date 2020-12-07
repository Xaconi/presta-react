import { fetchAPI, putAPI, postAPI } from './presta-api';
import { getTaxRuleGroups } from './presta-api-tax';
import { getLanguageByIsoCode } from './presta-api-lang';

export async function getProduct(idProduct, idProductAttribute = 0, languageId = 1) {
    const response = await fetchAPI(`products/${idProduct}`, `price[price_wt][use_tax]=1&price[price_wt][product_attribute]=${idProductAttribute}&language=${languageId}`);
    // const tax = await getTaxRuleGroups(response.product.id_tax_rules_group);
    return response.product;
}

export async function getCategoryProducts(idCategory, languageIsoCode) {
    const language = await getLanguageByIsoCode(languageIsoCode);
    const response = await fetchAPI(`categories/${idCategory}`);
    let products = [];
    if(response.category.associations.products) {
        products = await Promise.all(response.category.associations.products.map(
            async (product) => {
                return await getProduct(product.id, 0, language.id);
            }
        ));
    }

    return products;
}
