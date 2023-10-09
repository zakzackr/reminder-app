import axios from "axios";
import { getToken } from "./AuthService";

const BASE_REST_API_URL = "http://localhost:8080/api/reminder"

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken()
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
 
export const getAllReminders= (userId) => axios.get(BASE_REST_API_URL + '/' + userId)

export const addReminder = (userId, reminder) => axios.post(BASE_REST_API_URL + '/' + userId, reminder)

export const getReminder = (id, userId) => axios.get(BASE_REST_API_URL + '/' + userId + '/' + id)

export const updateReminder = (id, userId, reminder) => axios.put(BASE_REST_API_URL + '/' + userId + '/' + id, reminder)

export const deleteReminder = (id, userId) => axios.delete(BASE_REST_API_URL + '/' + userId + '/' + id)


