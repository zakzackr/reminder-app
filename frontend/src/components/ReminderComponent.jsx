import { useEffect, useState } from 'react'
import { addReminder, getReminder, updateReminder } from '../services/ReminderService'
import { useNavigate, useParams } from 'react-router'

import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const ReminderComponent = () => {

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [date, setDate] = useState()
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        
        if (id){
            getReminder(id).then((response) => {
                setTitle(response.data.title)
                setNote(response.data.note)
                setDate(response.data.date)
            }).catch(error => {
                console.error(error)
            })
        } 

    }, [id])

    function saveOrUpdateReminder(e){
        e.preventDefault()

        const reminder = {title, note, date}

        if (id){
            updateReminder(id, reminder).then((response) => {
                navigate(`/reminders`)
            }).catch(error => {
                console.error(error)
            })
        } else {
            addReminder(reminder).then((response) => {
                console.log(response)
                console.log(typeof reminder.date)  // : Object
                console.log(typeof response.data.date) // : String
                navigate(`/reminders`)
            }).catch(error => {
                console.error(error)
            })
        }
    }

    function pageTitle(){
        if (id){
            return <h2 style={{ fontWeight: 700, fontSize: "1.5rem", textAlign: "center", margin: "24px 0 18px 0" }}>リマインダー編集</h2>
        } else {
            return <h2 style={{ fontWeight: 700, fontSize: "1.5rem", textAlign: "center", margin: "24px 0 18px 0" }}>新規リマインダー</h2>
        }
    }

    function handleCancel(){
        navigate("/reminders");
    }

    return (
        <div className="container" style={{ maxWidth: 480, margin: "48px auto" }}>
            <div className="card" style={{ margin: "0 auto", padding: 0 }}>
                {pageTitle()}
                <p style={{ fontSize: '0.8rem',  textAlign: "center" }}>*現在は、毎週月曜日の8AMのみ設定可能です。</p>
                <div className="card-body" style={{ paddingTop: 16 }}>
                    <form>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "1rem" }}>
                                タイトル
                            </label>
                            <input
                                type="text"
                                placeholder="タイトルを入力"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "1rem" }}>
                                メモ
                            </label>
                            <input
                                type="text"
                                placeholder="メモを入力"
                                name="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "1rem" }}>
                                日時
                            </label> 
                            <DateTimePicker
                                className="form-control"
                                format="yyyy/MM/dd HH:mm"
                                minDate={new Date()}
                                onChange={(selectedDate) => {
                                    const fixedTimeDate = new Date(selectedDate);
                                    fixedTimeDate.setHours(8, 0, 0, 0);
                                    setDate(fixedTimeDate);
                                }}
                                value={date}
                                disableClock={true}
                                tileDisabled={({ date }) => date.getDay() !== 1}
                                disableCalendar={false}
                                hourPlaceholder="08"
                                minutePlaceholder="00"
                                clearIcon={null}
                                readOnly={true}  
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%"  }}>
                            <button className="btn" style={{ width: "18%" }} onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="btn" style={{ width: "18%" }} onClick={(e) => saveOrUpdateReminder(e)}>
                                Done
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReminderComponent
