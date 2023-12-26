import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice ({
  name: 'auth',
  initialState:{
        authenticated: false,
        user: {}
      },
  reducers:{
    login(state, action){

      // console.log('-------------from slice-------------')
      // console.log(action.payload)
      state.authenticated = action.payload.authenticated
      state.user = action.payload.user
    },
    logout(state, action){
      state.authenticated = false
      state.user = {}
    }
  }
});

export default authSlice.reducer
export const { login, logout } = authSlice.actions