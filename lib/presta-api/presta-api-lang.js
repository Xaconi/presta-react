import { fetchAPI } from './presta-api';

export async function getLangs() {
    const response = await fetchAPI(`languages`, `display=full`);
    return response.languages;
}
