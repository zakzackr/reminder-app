import axios from "axios";


import { useContext } from 'react'
import { AuthContext } from "../contexts/AuthContext"

const BASE_REST_API_URL = `${import.meta.env.VITE_BASE_URL}/reminders`

export const getAllReminders= () => {
    console.log("getAllRemindersAPICall()");
    return axios.get(BASE_REST_API_URL);
}

export const addReminder = (reminder) => axios.post(BASE_REST_API_URL, reminder)

export const getReminder = (id) => axios.get(BASE_REST_API_URL + '/' + id)

export const updateReminder = (id, reminder) => axios.put(BASE_REST_API_URL + '/' + id, reminder)

export const deleteReminder = (id) => axios.delete(BASE_REST_API_URL + '/' + id)


