import api from './api';

export async function getMainMenu () {
    const response = await api.get('/AcaiAPI/getmainmenu/0');
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}

export async function getSubmenu (catId) {
    const response = await api.get(`/AcaiAPI/getsubmenus/${catId}`);
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}

export async function getSizes (mainCategoryID) {
    const response = await api.get(`/AcaiAPI/GetSizes/${mainCategoryID}`);
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}

export async function getPrice (submenuItemID, sizeID) {
    const response = await api.get(`/AcaiAPI/GetPrice/${submenuItemID}/${sizeID}`);
    return response.data?.price ?? response.data ?? 0;
}

export async function getAddOns (categoryID) {
    const response = await api.get(`/Order/GetAddOns/${categoryID}`);
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}

export async function getAllergies () {
    const response = await api.get('/Order/GetAllergies');
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}
