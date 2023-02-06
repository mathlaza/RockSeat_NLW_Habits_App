import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://august-representative-production.up.railway.app/'
})