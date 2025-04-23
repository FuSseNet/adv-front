import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import baseUrl from "../../../../config/config"
import ErrorInterface from "../../../../common/ErrorInterface"

const loginUrl = "api/Auth/login"
const logoutUrl = "api/Auth/logout"
const refreshUrl = "api/Auth/refresh"
const local_refresh_key = "Local_access"
const local_rememberMe_key = "Local_rememberMe"

interface UserSessionState{
    accessToken: string | null,
    pending: boolean,
    erorr:string | null
}

const initialState : UserSessionState = {
    accessToken: null,
    pending: false,
    erorr: null
}

interface LoginResponseInterface{
    accessToken: string,
    refreshToken: string,
    loginSucceded:boolean
}

interface LoginInterface{
    email:string,
    password:string,
    rememberMe:boolean
}

interface Token{
    access:string,
    refresh:string
}

export const login = createAsyncThunk<Token, LoginInterface>(
    "user-session.login.",
    async (data: LoginInterface, {rejectWithValue}) => {
        try{
            const response = await axios.post<LoginResponseInterface>(baseUrl + loginUrl, data);
            if (!response.data.loginSucceded){
                const error: ErrorInterface = {
                    status:404,
                    message:"Unathorized",
                    payload:null
                }
                return rejectWithValue(error);
            }
            localStorage.setItem(local_refresh_key, response.data.refreshToken)
            return {
                access: response.data.accessToken,
                refresh: response.data.refreshToken
            };
        }
        catch (err){
            if (axios.isAxiosError(err)){
                const errorResp: ErrorInterface = {
                    status: err.response?.status || -1,
                    message: err.response?.statusText || "Unknown",
                    payload: err.response?.data
                }
                return rejectWithValue(errorResp)
            }
            return rejectWithValue({
                status:"internal",
                message:"Think"
            })
        }
    }
)

export const logout = createAsyncThunk(
    "user-session.logout.",
    async (token: string, {rejectWithValue}) => {
        try{
            const response = await axios.post(baseUrl + logoutUrl,null,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
        }
        catch(err){
            if (axios.isAxiosError(err)){
                const errorResp: ErrorInterface = {
                    status: err.response?.status || -1,
                    message: err.response?.statusText || "Unknown",
                    payload: err.response?.data
                }
                return rejectWithValue(errorResp)
        }
    }
})

export const sessionRefresh = createAsyncThunk(
    "user-session-slice.refresh",
    async (_, {rejectWithValue}) => {
        const refreshToken = localStorage.getItem(local_refresh_key)
        if (refreshToken){
            try{
                const response = await axios.post<Token>(baseUrl + refreshUrl,{
                    refreshToken: refreshToken
                })
                return response.data
            }
            catch(err){
                if (axios.isAxiosError(err)){
                    if (err.response?.status == 401){
                        localStorage.removeItem(local_refresh_key)
                    }
                    const errorResp: ErrorInterface = {
                        status: err.response?.status || -1,
                        message: err.response?.statusText || "Unknown",
                        payload: err.response?.data
                    }
                    return rejectWithValue(errorResp)
                }
                return rejectWithValue({
                    status:"internal",
                    message:"Think"
                })
            }
        }
        const error : ErrorInterface = {
                status: 401,
                message: "Unauthorized",
                payload: null
            }
            return rejectWithValue(error)
    }
)

const authSlice = createSlice({
    name: "user-session",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state, action) => {
            state.pending = true
            state.erorr = null
        })
        .addCase(login.fulfilled, (state, action) => {
            state.pending = false
            state.erorr = null
            state.accessToken = action.payload.access
            if (action.meta.arg.rememberMe){
                localStorage.setItem(local_refresh_key, action.payload.refresh)
            }
        })
        .addCase(login.rejected, (state, action) => {
            state.pending = false
            state.erorr = action.error.message || "Untracked error"
        })
        .addCase(logout.pending, (state, action) => {
            state.pending = true
            state.erorr = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.accessToken = null
            state.erorr = null
            state.pending = false
            localStorage.removeItem(local_refresh_key)
        })
        .addCase(logout.rejected, (state, action) => {
            state.erorr = action.error.message || "Untracked error"
            state.pending = false
        })
        .addCase(sessionRefresh.pending, (state) => {})
        .addCase(sessionRefresh.fulfilled, (state, action) => {
            state.accessToken = action.payload.access
            if (localStorage.getItem(local_refresh_key)){
                localStorage.setItem(local_refresh_key, action.payload.refresh)
            }
        })
        .addCase(sessionRefresh.rejected, (state, action) => {
            state.accessToken = null
            state.erorr = action.error.message || "Untracked error"
            localStorage.removeItem(local_refresh_key)
        })
    }
})

export default authSlice.reducer