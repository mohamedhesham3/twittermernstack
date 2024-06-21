import axios from 'axios';
const token=localStorage.getItem('token')
const Api = axios.create({
  baseURL: "https://twittermernstack-dpve0n29e-mohamedds-projects.vercel.app/",
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export default Api;
