import { fetchAPI } from './presta-api';

export async function getLanguages() {
    const response = await fetchAPI(`languages`, `display=full`);
    return response.languages;
}

export async function getLanguageByIsoCode(languageIsoCode) {
    const response = await fetchAPI(`languages`, `filter[iso_code]=${languageIsoCode}`);
    return response.languages[0];
}
