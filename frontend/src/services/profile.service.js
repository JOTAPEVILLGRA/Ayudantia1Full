import axios from './root.service.js';

export async function getProfile() {
    try {
        const { data } = await axios.get('/profile/private');
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.details || 'Error al obtener el perfil');
    }
}

export async function updateProfile(profileData) {
    try {
        const { data } = await axios.patch('/profile/private', profileData);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.details || 'Error al actualizar el perfil');
    }
}

export async function deleteProfile() {
    try {
        const { data } = await axios.delete('/profile/private');
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.details || 'Error al eliminar el perfil');
    }
}
