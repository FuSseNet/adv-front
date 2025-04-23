import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { reducersBundle } from './slices'

const persistConfig = {
    key: 'root',
    storage
}

export const persistReduser = persistReducer(persistConfig, reducersBundle)