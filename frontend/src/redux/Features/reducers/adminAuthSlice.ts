import { createSlice } from "@reduxjs/toolkit";

const data = localStorage.getItem('adminToken') ?? '';
const parsedData:{token:string} | null= data ? JSON.parse(data) : null;
const initialState = {
    data: parsedData ?? {
        token:'',
    }
};

const adminAuthSlice = createSlice({
    name:'admin',
    initialState,
    reducers: {
        setAdminToken(state,action){
            localStorage.setItem(
                'adminToken',
                JSON.stringify({
                    token:action.payload.token
                })
            )
          state.data= { token:action.payload.token }
        },
        deleteAdminToken(state){
            state.data = {
                token:'',
            }
            localStorage.removeItem('adminToken');
        }
    }
})

export const {setAdminToken, deleteAdminToken} = adminAuthSlice.actions;

export const selectAdminAuth = (state:{adminAuth:{data:{token:string}}})=> state.adminAuth.data

export const adminAuthReducer = adminAuthSlice.reducer;
