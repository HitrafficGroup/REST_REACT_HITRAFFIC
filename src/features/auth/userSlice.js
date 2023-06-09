import {createSlice} from '@reduxjs/toolkit';


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        ci: '',
        email:'',
        lastname:'',
        name:'',
        password:'',
        second_lastname:'',
        id:''
    },
    reducers: {
        setUser: (state,action)=>{
            state.ci = action.payload.ci;
            state.email = action.payload.email;
            state.lastname = action.payload.lastname;
            state.name = action.payload.name;
            state.password = action.payload.password;
            state.second_lastname = action.payload.second_lastname;
            state.id = action.payload.id;
        },
    }
})
export const {setUser} = userSlice.actions
export default userSlice.reducer