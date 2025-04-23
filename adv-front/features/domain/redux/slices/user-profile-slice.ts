import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { Profile } from "../data/profile";
import { axBuilder } from "../../../../common/axios-builder";
import axios from "axios";
import ErrorInterface from "../../../../common/ErrorInterface";
import { fileDto } from "../data/file";

const getProfileUrl = "api/profile"

interface UserProfileState{
    user: Profile | null,
    pending: boolean,
    error: string | null,
    avatarBase64: string | null
}

interface AvatarDto{
    base64: string | null
}

const initialState : UserProfileState = {
    user: null,
    pending: false,
    error: null,
    avatarBase64: null,
}

const getProfile = createAsyncThunk(
    "user-profile-slice.get",
    async (_, {rejectWithValue, dispatch}) => {
        try{
            const response = await axBuilder.get<Profile>(
                getProfileUrl
            )
            dispatch(getAvatar(response.data.avatar))
            return response.data
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
        return rejectWithValue({
            status: "internal",
            message: "Think"
        })
    }
)

const getAvatar = createAsyncThunk(
    "user-profile-slice.getAvatar",
    async (file: fileDto, {rejectWithValue}) => {
        try{
            const response = await axBuilder.get(`api/Profile/avatar${file.id}`, {
                responseType: 'blob'
            })
            const blob  = response.data

            return new Promise<AvatarDto>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    const dto: AvatarDto = {
                        base64
                    }
                    resolve(dto)
                }
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
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
        return rejectWithValue({
            status: "internal",
            message: "Think"
        })
    }
)
const UserProfileSlice = createSlice({
    name: "user-profile-slice",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getProfile.pending, (state) => {
            state.pending = true
            state.error = null
        })
        .addCase(getProfile.fulfilled, (state, action) => {
            state.pending = false
            state.error = null
            state.user = action.payload
        })
        .addCase(getProfile.rejected, (state, action) => {
            state.pending = false
            state.error = action.error.message || "Untracked error"
        })
        .addCase(getAvatar.fulfilled, (state, action) => {
            state.pending = false
            state.avatarBase64 = action.payload.base64
        })
        .addCase(getAvatar.rejected, (state, action) => {
            state.pending = false
            state.error = action.error.message || "Untracked error"
        })
    }
})

export default UserProfileSlice.reducer
