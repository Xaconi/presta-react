import { fetchAPI } from './presta-api';
import { getLanguageByIsoCode } from './presta-api-lang';

export async function getCategories() {
    const response = await fetchAPI(`categories/`, `display=[link_rewrite]`);
    return response;
}

export async function getCategory(idCategory) {
    const response = await fetchAPI(`categories/${idCategory}`);
    return response.category;
}

export async function getCategoryByURL( categoryURL, languageIsoCode ) {
    const language = await getLanguageByIsoCode(languageIsoCode);
    const { categories } = await fetchAPI(`categories/`, `filter[link_rewrite]=${categoryURL}&language=${language.id}&display=full`);
    return categories[0];
}
