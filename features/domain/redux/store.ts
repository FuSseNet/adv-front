import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slices/user-sessions-slice";
import {reducersBundle} from "./slices"
import {persistStore} from "redux-persist"
import { persistReduser } from "./persist";

export const store = configureStore({
    reducer: persistReduser,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/FLUSH', 'persist/PURGE', 'persist/REGISTER']
            },
        }),
})

export const persistor = persistStore(store)