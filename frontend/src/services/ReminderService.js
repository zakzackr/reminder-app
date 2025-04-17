import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/reminders"
 
export const getAllReminders= () => axios.get(BASE_REST_API_URL)

export const addReminder = (reminder) => axios.post(BASE_REST_API_URL, reminder)

export const getReminder = (id) => axios.get(BASE_REST_API_URL + '/' + id)

export const updateReminder = (id, reminder) => axios.put(BASE_REST_API_URL + '/' + id, reminder)

export const deleteReminder = (id) => axios.delete(BASE_REST_API_URL + '/' + id)


