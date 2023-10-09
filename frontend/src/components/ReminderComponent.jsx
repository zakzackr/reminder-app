import { useEffect, useState } from 'react'
import { addReminder, getReminder, updateReminder } from '../services/ReminderService'
import { useNavigate, useParams } from 'react-router'
import { getUserId } from '../services/AuthService'

const ReminderComponent = () => {

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [date, setDate] = useState(false)
    const nav = useNavigate()
    const { id } = useParams();
    const userId = getUserId();

    useEffect(() => {
        
        if (id){
            getReminder(id, userId).then((response) => {
                console.log(response.data)
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
            updateReminder(id, userId, reminder).then((response) => {
                console.log(response)
                nav(`/reminder/${userId}`)
            }).catch(error => {
                console.error(error)
            })
        } else {
            addReminder(userId, reminder).then((response) => {
                console.log(response)
                nav(`/reminder/${userId}`)
            }).catch(error => {
                console.error(error)
            })
        }
    }

    function pageTitle(){
        if (id){
            return <h2 className='text-center mt-4'>Edit Reminder</h2>
        } else {
            return <h2 className='text-center mt-4'>New Reminder</h2>
        }
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    { pageTitle() }
                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Title:</label>
                                <input 
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter new title'
                                    name='title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                >
                                </input>
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Notes:</label>
                                <input 
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter notes'
                                    name='note'
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                >
                                </input>
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Date:</label>
                                <input 
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter date'
                                    name='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                >
                                </input>
                            </div>
                            <button className='btn btn-success' onClick={(e) => saveOrUpdateReminder(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default ReminderComponent