import axios  from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.0.3:3333' // Usar o url físico ao invés de localhost para funcionar no andriod
});