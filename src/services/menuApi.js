import api from './api';

export async function getMainMenu () {
    const response = await api.get('/getmainmenu/0');
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}

export async function getSubmenu (catId) {
    const response = await api.get(`/getsubmenus/${catId}`);
    return Array.isArray(response.data) ? response.data : response.data.items || [];
}
