import axios from 'axios';

export default axios.create({
  baseURL: 'https://fyp-luxury-watch-production.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});