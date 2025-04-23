import axios from "axios"
import {store} from "../features/domain/redux/store"
import { sessionRefresh } from "../features/domain/redux/slices/user-sessions-slice"
import baseUrl from "../config/config"

const axiosBuilder = () => {
    const axiosInstance = axios.create({
        baseURL: baseUrl,
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            const state = store.getState()
            const token = state.session.accessToken
            if (token){
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
    })

    axiosInstance.interceptors.response.use(
        response => response,
        async (error) => {
            const request = error.config
            if (error.response.status == 401 && request._retry){
                request._retry = true;
                await store.dispatch(sessionRefresh());
                const newState = store.getState()
                request.headers.Authorization = `Bearer ${newState.session.accessToken}`
                return axiosInstance(request);
            }
            return Promise.reject(error)
        }
    )
    return axiosInstance
}
export const axBuilder =  axiosBuilder();