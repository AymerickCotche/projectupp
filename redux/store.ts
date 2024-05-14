import { configureStore } from "@reduxjs/toolkit"
import contactReducer from './features/contactSlice'
import groupReducer from './features/groupSlice'
import campaignReducer from './features/campaignSlice'
import emailTextReducer from './features/emailTextSlice'
import displayReducer from './features/displaySlice'
import contactsDocumentReducer from './features/contactsDocumentSlice'

const defaultMiddlewareConfig = {
  serializableCheck: false
}

export const store = configureStore({
  reducer: {
    contact: contactReducer,
    group: groupReducer,
    campaign: campaignReducer,
    emailText: emailTextReducer,
    display: displayReducer,
    contactsDocument: contactsDocumentReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(defaultMiddlewareConfig),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch