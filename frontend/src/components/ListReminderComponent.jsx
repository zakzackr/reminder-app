import React, { useEffect, useState } from 'react'
import {deleteReminder, getAllReminders} from '../services/ReminderService'
import { useNavigate } from 'react-router'
import { getUserId, isAdminUser } from '../services/AuthService'

const ListReminderComponent = () => {

    const [reminders, setReminders] = useState([])
    const nav = useNavigate()
    const isAdmin = isAdminUser()
    const userId = getUserId();

    useEffect(() => {
        listReminders(userId)
    }, [])

    function listReminders(userId){
        getAllReminders(userId).then(response => {
            setReminders(response.data)
        }).catch(error => {
            console.error(error)
        })
    }

    function addNewReminder(userId){
        nav(`/add-reminder/${userId}`)
    }

    // id: reminderId
    function updateReminder(id, userId){
        console.log(id)
        nav(`/update-reminder/${userId}/${id}`)
    }

    function removeReminder(id, userId){
        deleteReminder(id, userId).then((response) => {
            console.log(response)
            listReminders(userId)
        }).catch(error => {
            console.error(error)
        })
    }

    return (
        <div className='container'>
            <h2 className='text-center mt-2'>List</h2>
            <button className='btn btn-primary mb-2' onClick={() => addNewReminder(userId)}>New Reminder</button>

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
                                    <td>{reminder.date}</td>
                                    <td>
                                        {
                                            isAdmin &&
                                            <button className='btn btn-info' onClick={() => updateReminder(reminder.id, userId)} style={ { marginRight:'10px' }} >Update</button>
                                        }
                                        <button className='btn btn-danger' onClick={() => removeReminder(reminder.id, userId)} style={ { marginRight:'10px' }}>Delete</button>
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