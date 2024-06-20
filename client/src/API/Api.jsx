import axios from 'axios';
const token=localStorage.getItem('token')
const Api = axios.create({
  baseURL: 'https://xmernstack.onrender.com/',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export default Api;