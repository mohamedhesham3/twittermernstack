import axios from 'axios';
const token=localStorage.getItem('token')
const Api = axios.create({
  baseURL: "https://twittermernstack.onrender.com/",
  
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export default Api;
