import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface EventContact {
  id: string
  nom: string
  counter: number
}

interface Event {
  id: string
  name: string
  eventContacts: EventContact[]
}

interface Campaign {
  id: string
  nom: string
  events: Event[]
}

interface Group {
  id: string
  nom: string
  campaigns: Campaign[] | undefined
}

interface Demande {
  id: string
  content: string
  quantity: number
  finition: string
  createdAt: string
}

interface Contact {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  createdAt?: string
  groups?: Group[]
  demandes?: Demande[]
}

type Doc = {
  id: string
  docId: string
  date: string
  montant: string
  contactId: string
  campagnes: string
  fromBcdi: boolean
  bcdiDate: string | null
  createdAt: string
  updatedAt: string
  contact: Contact
  docName: string
  bcdiName: string | null
}

type ContactsDocumentState = {
  docs: Doc[]
  displayedDocs: Doc[]
  maxPage: number
  page: number
  loading: boolean
}

const initialState = {
  docs: [],
  displayedDocs: [],
  loading: false,
  maxPage: 0,
  page: 1
} as ContactsDocumentState

export const contactsDocument = createSlice({
  name: "contactsDocument",
  initialState,
  reducers: {
    toggleContactsDocumentIsLoading(state) {
      state.loading = !state.loading
    },
    setMaxPage(state, action) {
      state.maxPage = action.payload
    },
    setPage(state, action) {
      state.page = action.payload
    },
    setDisplayedDocs(state, action) {
      state.displayedDocs = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContactsDocument.fulfilled, (state, action) => {
        state.docs = action.payload
        state.loading = false
      })
      .addCase(getContactsDocument.pending, (state) => {
        state.loading = true
      })
      .addCase(getContactsDocument.rejected, (state, action) => {
        state.loading = false
      })
    }
})

export const {
  toggleContactsDocumentIsLoading,
  setMaxPage,
  setPage,
  setDisplayedDocs
} = contactsDocument.actions

export const getContactsDocument = createAsyncThunk(
  'contactsDocument/getContactsDocument',
  async (pageNumber: number) => {
    const response = await fetch(`/api/contactsDocs?pagenumber=${pageNumber}`)
    const results =  await response.json()
    return results
  }
)

export default contactsDocument.reducer