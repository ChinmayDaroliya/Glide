'use client'

import AutmationReducer from '@/redux/slices/automation'
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {TypedUseSelectorHook, useSelector} from 'react-redux'

const rootReducer = combineReducers({
    AutmationReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector