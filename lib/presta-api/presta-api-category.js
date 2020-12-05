import { fetchAPI } from './presta-api';

export async function getCategories() {
    const response = await fetchAPI(`categories/`, `display=[link_rewrite]`);
    return response;
}

export async function getCategory(idCategory) {
    const response = await fetchAPI(`categories/${idCategory}`);
    return response.category;
}

export async function getCategoryByURL( categoryURL ) {
    const { categories } = await fetchAPI(`categories/`, `filter[link_rewrite]=${categoryURL}`);
    return categories[0].id;
}