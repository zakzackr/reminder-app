import React, { useContext, useEffect, useState } from 'react'
import {deleteReminder, getAllReminders} from '../services/ReminderService'
import { useNavigate } from 'react-router'

import { AuthContext } from "../contexts/AuthContext"


const ListReminderComponent = () => {

    const [reminders, setReminders] = useState([])
    const nav = useNavigate()
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        console.log("checking if accesstoken exists in listReminderComponent (useEffect): " + accessToken);
        if (accessToken) {
            console.log("listReminders()");
          listReminders();
        }
      }, [accessToken]);

    function listReminders(){
        getAllReminders().then(response => {
            console.log("getAllReminders() success");
            setReminders(response.data)
        }).catch(error => {
            console.log("getAllReminders() is returing an error");
            console.error(error)
        })

        console.log("inside listReminders()");
    }

    function addNewReminder(){
        nav(`/add-reminder`)
    }

    // id: reminderId
    function updateReminder(id){
        nav(`/update-reminder/${id}`)
    }

    function removeReminder(id){
        deleteReminder(id).then((response) => {
            console.log(response)
            listReminders()
        }).catch(error => {
            console.error(error)
        })
    }

    function dateTimeConverter(date){
        // console.log(typeof date)  // date: String in ISO 8601 format
        const dateObj = new Date(date)  // dateObj represents date/time in the user's local time zone
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;

        return formattedDate;
    }

    return (
        <div className='container'>
            <h2 className='text-center mt-2'>List</h2>
            <button className='btn btn-primary mb-2' onClick={() => addNewReminder()}>New Reminder</button>

            <div>
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Notes</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reminders.map(reminder => 
                                <tr key={reminder.id}>
                                    <td>{reminder.title}</td>
                                    <td>{reminder.note}</td>
                                    <td>{dateTimeConverter(reminder.date)}</td>
                                    <td>
                                        <button className='btn btn-info' onClick={() => updateReminder(reminder.id)} style={ { marginRight:'10px' }} >Update</button>
                                        <button className='btn btn-danger' onClick={() => removeReminder(reminder.id)} style={ { marginRight:'10px' }}>Delete</button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListReminderComponent