import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:9000/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

export const registerSchool = (payload) => api.post('api/accounts/register', payload);




// ✅ CURRENT USER
export const get_me = () =>
    api.get('account/me/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`
        }
    });


// ✅ LOGIN
export const login = (payload) => api.post('api/token', payload);
// ✅ REGISTER SCHOOL


export default api;
