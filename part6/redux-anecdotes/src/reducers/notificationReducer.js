import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotificaton() {
      return null
    }
  }
})

export const { setNotification, removeNotificaton } = notificationSlice.actions
export default notificationSlice.reducer