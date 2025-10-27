import axios from './root.service.js';

export async function login(dataUser) {
  try {
    const { data } = await axios.post('/auth/login', dataUser);
    const { token, user } = data.data || {};
    
    if (token) {
      localStorage.setItem('jwt-auth', token); // Guarda el token en localStorage
    }
    
    sessionStorage.setItem('usuario', JSON.stringify(user));
    return data;
  } catch (error) {
    return error.response?.data || { message: 'Error al conectar con el servidor' };
  }
}

export async function register(data) {
    try {
        const { email, password } = data;
        const response = await axios.post('/auth/register', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function logout() {
    try {
        sessionStorage.removeItem('usuario');
        localStorage.removeItem('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
