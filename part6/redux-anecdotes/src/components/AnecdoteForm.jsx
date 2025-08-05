import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotificaton } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newNotification = (message) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(removeNotificaton())
    }, 5000)
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value =''

    newNotification(`you created ${content}`)
    dispatch(createAnecdote(content))
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm