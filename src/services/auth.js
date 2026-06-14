import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// ✅ LOGIN
export const login = (payload) => api.post('api/token/', payload);

// ✅ REGISTER
export const register = (payload) => api.post('account/register/', payload);

// ✅ CURRENT USER
export const get_me = () =>
    api.get('account/me/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`
        }
    });

export default api;
