import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface Group {
  id: string
  nom: string
}

interface EmailText {
  id: string
  nom: string
  content: string
  design?: string
}

type EmailTextState = {
  emailTexts: EmailText[]
  loading: boolean
  selectedEmailText: EmailText | null
}

const initialState = {
  emailTexts: [],
  loading: false,
  editCampaignModal: false,
  openAddCampaignModal: false,
  selectedEmailText: null,
} as EmailTextState

export const emailText = createSlice({
  name: "emailText",
  initialState,
  reducers: {
    setEmailTextxIsLoading(state, action) {
      state.loading = action.payload
    },
    setSelectedEmailText(state, action) {
      state.selectedEmailText = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmailTexts.fulfilled, (state, action) => {
        state.emailTexts = action.payload
      })
      .addCase(saveEmailtext.fulfilled, (state, action) => {
        state.selectedEmailText = action.payload
      })

    }  
})

export const {
  setEmailTextxIsLoading,
  setSelectedEmailText
} = emailText.actions

export const getAllEmailTexts = createAsyncThunk(
  'emailText/getAllEmailTexts',
  async () => {
    const response = await fetch(`/api/emailtext/getall`)
    const results =  await response.json()
    return results
  }
)

export const saveEmailtext = createAsyncThunk(
  'emailText/saveEmailtext',
  async ({emailTextContent, emailTextName, emailTextDesign}: {emailTextContent: string,  emailTextDesign: string, emailTextName: string}) => {
    const response = await fetch(`/api/emailtext/addone`, {
      method: 'POST',
      body: JSON.stringify({
        emailTextContent,
        emailTextDesign,
        emailTextName
      })
    })
    const results =  await response.json()
    return results
  }
)

export const updateEmailtext = createAsyncThunk(
  'emailText/updateEmailtext',
  async ({emailTextContent, emailTextName, emailTextDesign, emailTextId}: {emailTextContent: string,  emailTextDesign: string, emailTextName: string, emailTextId: string}) => {
    const response = await fetch(`/api/emailtext/update?emailTextId=${emailTextId}`, {
      method: 'PUT',
      body: JSON.stringify({
        emailTextContent,
        emailTextDesign,
        emailTextName
      })
    })
    const results =  await response.json()
    return results
  }
)

export default emailText.reducer