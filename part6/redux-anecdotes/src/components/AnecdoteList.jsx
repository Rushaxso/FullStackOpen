import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotificaton } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes}) => {
    if (filter === ''){
      return anecdotes
    }
    return anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase()))

  })
  const dispatch = useDispatch()

  const newNotification = (message) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(removeNotificaton())
    }, 5000)
  }

  const vote = (id) => {
    const anecdote = anecdotes.find(anecdote => anecdote.id === id)
    newNotification(`you voted ${anecdote.content}`)
    dispatch(voteAnecdote(id))
  }

  return(
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList