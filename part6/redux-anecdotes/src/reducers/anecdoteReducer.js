import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const sortState = (state) => {
  return [...state].sort((anec1, anec2) => anec2.votes - anec1.votes)
}

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const anecdote = asObject(action.payload)

      state.push(anecdote)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const votedAnec = state.find(anecdote => anecdote.id === id)
      const changedAnec = { ...votedAnec, votes: votedAnec.votes + 1}
      return sortState(state.map(anecdote => anecdote.id !== id ? anecdote : changedAnec))
    }
  }
})

/*export const createAnecdote = (content) => {
  return {
    type: 'NEW',
    payload: {
      anecdote: asObject(content)
    }
  }    
}

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    payload: { id }
  }
} 

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'NEW': {
      return [...state, action.payload.anecdote]
    }
    case 'VOTE': {
      const id = action.payload.id
      const votedAnec = state.find(anecdote => anecdote.id === id)
      const changedAnec = { ...votedAnec, votes: votedAnec.votes + 1}
      return sortState(state.map(anecdote => anecdote.id !== id ? anecdote : changedAnec))
    }
    default:
      return state
  }
}*/
export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer