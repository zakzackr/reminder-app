import React, { useContext, useEffect, useState } from 'react'
import {deleteReminder, getAllReminders} from '../services/ReminderService'
import { useNavigate } from 'react-router'

import { AuthContext } from "../contexts/AuthContext"


const ListReminderComponent = () => {

    const [reminders, setReminders] = useState([])
    const nav = useNavigate()
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        if (accessToken) {
          listReminders();
        }
      }, [accessToken]);

    function listReminders(){
        getAllReminders().then(response => {
            setReminders(response.data)
        }).catch(error => {
            console.error(error)
        })
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
            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", textAlign: "center", margin: "24px 0 18px 0" }}>Reminder List</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
                <button className="btn" onClick={() => addNewReminder()}>＋ 新規リマインダー</button>
            </div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>タイトル</th>
                            <th>メモ</th>
                            <th>日時</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminders.map(reminder => 
                            <tr key={reminder.id}>
                                <td data-label="タイトル">{reminder.title}</td>
                                <td data-label="メモ">{reminder.note}</td>
                                <td data-label="日時">{dateTimeConverter(reminder.date)}</td>
                                <td data-label="操作">
                                    <button className="btn btn-info" onClick={() => updateReminder(reminder.id)} style={{ marginRight: 6 }}>編集</button>
                                    <button className="btn btn-danger" onClick={() => removeReminder(reminder.id)}>削除</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListReminderComponent
