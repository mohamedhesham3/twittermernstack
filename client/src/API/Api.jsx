import axios from 'axios';
const token=localStorage.getItem('token')
const Api = axios.create({
  baseURL: "https://twittermernstack-6lh1.vercel.app/",
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export default Api;