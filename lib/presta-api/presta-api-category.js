import { fetchAPI } from './presta-api';

export async function getCategory(idCategory) {
    const response = await fetchAPI(`categories/${idCategory}`);
    return response.category;
}
