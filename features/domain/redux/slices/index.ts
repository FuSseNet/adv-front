import { combineReducers } from "@reduxjs/toolkit"
import session from "./user-sessions-slice"
import profile from './user-profile-slice'

export const reducersBundle = combineReducers({
    session,
    profile
})