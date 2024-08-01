import React from 'react'
import axios from 'axios';

const apiUrl = process.env.REACT_APP_MAIN_URL;

const ApiConnector = axios.create({
    baseURL: apiUrl,
});

ApiConnector.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log("token added to hearder:", token)
      }
      return config;
    },
    (error) => {
        console.log("token nhi mila")
      return Promise.reject(error);
    }
  );
  
export default ApiConnector;