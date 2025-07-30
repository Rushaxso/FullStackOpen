import { createNote, toggleImportanceOf } from './reducers/noteReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {

  return (
    <div>
      <NewNote />
      <Notes />
    </div>
  )
}

export default App