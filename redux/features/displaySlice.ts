import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

type DisplayState = {
  isSaving: boolean
  openModalSaving: boolean
  showFilterComp: boolean
}

const initialState = {
  isSaving: false,
  openModalSaving: false,
  showFilterComp: false
} as DisplayState

export const display = createSlice({
  name: "display",
  initialState,
  reducers: {
    toggleIsSaving(state) {
      state.isSaving = !state.isSaving
    },
    toggleOpenModalSaving(state) {
      state.openModalSaving = !state.openModalSaving
    },
    toggleShowFilterComp(state) {
      state.showFilterComp = !state.showFilterComp
    }
  }
})

export const {
  toggleIsSaving,
  toggleOpenModalSaving,
  toggleShowFilterComp
} = display.actions

export default display.reducer