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

type ContactState = {
  updateMessage: string
  contacts: Contact[]
  searchContactInput: string
  loadingContactDetails: boolean
  searchContactTerm: string
  editContactModal: boolean
  addContactModal: boolean
  message: string
  loading: boolean
  updateGroupsLoading: boolean
  selectedContact: Contact | null
  selectedContactEdit : Contact | null
  editContactForm: {
    nom: string
    prenom: string
    email: string
    telephone: string
  }
  addContactForm: {
    nom: string
    prenom: string
    email: string
    telephone: string
    groups: Group[]
  }
  contactIsSaving: boolean
  openContactSavingModal: boolean
  groupsToUpdate: {
    groupsToAdd: Group[]
    groupsToRemove: Group[]
  }
  showContactDetails: boolean
  selectedIdDetails: string
}

type EditContactFormField = keyof ContactState['editContactForm'];
type AddContactFormField = keyof ContactState['addContactForm'];

interface EditContactFormAction {
  type: string
  payload: {
    name: EditContactFormField
    value: string
  }
}

interface AddContactFormAction {
  type: string
  payload: {
    name: AddContactFormField
    value: string
  }
}

const initialState = {
  contacts: [],
  updateMessage: '',
  message: '',
  searchContactInput: '',
  searchContactTerm: '',
  loading: false,
  editContactModal: false,
  addContactModal: false,
  updateGroupsLoading: false,
  selectedContact: null,
  selectedContactEdit: null,
  loadingContactDetails: false,
  editContactForm: {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  },
  addContactForm: {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    groups: []
  },
  contactIsSaving: false,
  openContactSavingModal: false,
  groupsToUpdate: {
    groupsToAdd: [],
    groupsToRemove: []
  },
  showContactDetails: false,
  selectedIdDetails: ''
} as ContactState

export const contact = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContactsIsLoading(state, action) {
      state.loading = action.payload
    },
    toogleEditContactModal(state, action) {
      state.editContactModal = action.payload
    },
    toogleAddContactModal(state, action) {
      state.addContactModal = action.payload
    },
    setSelectedContact(state, action) {
      state.selectedContact = action.payload
    },
    addAGroup(state, action) {
      if (state.selectedContact && state.selectedContact?.groups) {

        state.selectedContact.groups = [...state.selectedContact?.groups, action.payload]

      }
    },
    addGroupAddModal(state, action) {
      state.addContactForm.groups = [...state.addContactForm.groups, action.payload]
    },
    removeAGroup(state, action) {
      if (state.selectedContact && state.selectedContact?.groups) {
        state.selectedContact.groups = state.selectedContact.groups.filter(group => group.id !== action.payload.id)
      }
    },
    removeGroupAddModal(state, action) {
      state.addContactForm.groups = state.addContactForm.groups.filter(group => group.id !== action.payload.id)
    },
    setUpdateGroupsIsLoading(state, action) {
      state.updateGroupsLoading = action.payload
    },
    setEditContactForm(state: ContactState, action: EditContactFormAction) {
      state.editContactForm[action.payload.name] = action.payload.value
    },
    setInputAddContactForm(state: ContactState, action: AddContactFormAction) {
      if (action.payload.name !== 'groups') {
        state.addContactForm[action.payload.name] = action.payload.value
      }
    },
    updateUserGroups(state, action) {
      if (state.selectedContact) {
        if (state.selectedContact.groups) {
          if (action.payload.action === 'add') {
            state.selectedContact.groups = [...state.selectedContact.groups, action.payload.group]
            state.groupsToUpdate.groupsToAdd.push(action.payload.group)
          } else if (action.payload.action === 'remove') {
            state.selectedContact.groups = state.selectedContact.groups.filter(group => group.id !== action.payload.group.id)
            state.groupsToUpdate.groupsToRemove.push(action.payload.group)
          }
        }
      }
    },
    toggleContactIsSaving(state) {
      state.contactIsSaving = !state.contactIsSaving
    },
    toggleOpenContactSavingModal(state) {
      state.openContactSavingModal = !state.openContactSavingModal
    },
    setMessage(state, action) {
      state.message = action.payload
    },
    toggleContactDetails(state) {
      state.showContactDetails = !state.showContactDetails
    },
    setSelectedIdDetails(state, action) {
      state.selectedIdDetails = action.payload
    },
    setSearchContactInput(state, action) {
      state.searchContactInput = action.payload
    },
    setSearchContactTerm(state, action) {
      state.searchContactTerm = action.payload
    },
    setLoadingContactDetails(state, action) {
      state.loadingContactDetails = action.payload
    },
    setSelectedContactEdit(state, action) {
      state.selectedContactEdit = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.contacts = action.payload
      })
      .addCase(getOneContact.fulfilled, (state, action) => {
        state.selectedContact = action.payload
      })
      .addCase(updateContactGroup.fulfilled, (state, action) => {
        state.updateGroupsLoading = false
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts = [...state.contacts, action.payload]
      })
      .addCase(getOneContactWithAllDetails.fulfilled, (state, action) => {
        state.selectedContact = action.payload
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const updatedIndex = state.contacts.findIndex(contact => contact.id === action.payload.id)
        state.contacts[updatedIndex] = action.payload
        state.updateMessage = "Contact mis à jour !"
      })
    }
})

export const {
  setContactsIsLoading,
  toogleEditContactModal,
  toogleAddContactModal,
  setSelectedContact,
  addAGroup,
  removeAGroup,
  setUpdateGroupsIsLoading,
  setEditContactForm,
  addGroupAddModal,
  setInputAddContactForm,
  removeGroupAddModal,
  toggleContactIsSaving,
  toggleOpenContactSavingModal,
  updateUserGroups,
  setMessage,
  toggleContactDetails,
  setSelectedIdDetails,
  setSearchContactInput,
  setSearchContactTerm,
  setLoadingContactDetails,
  setSelectedContactEdit
} = contact.actions

export const getAllContacts = createAsyncThunk(
  'contact/getAllContacts',
  async () => {
    const response = await fetch(`/api/contact/getall`)
    const results =  await response.json()
    return results
  }
)

export const getOneContact = createAsyncThunk(
  'contact/getOneContact',
  async ({contactId}: {contactId: string}) => {
    const response = await fetch(`/api/contact/getone?contactId=${contactId}`)
    const results =  await response.json()
    return results
  }
)

export const getOneContactWithAllDetails = createAsyncThunk(
  'contact/getOneContactWithAllDetails',
  async ({contactId}: {contactId: string}) => {
    const response = await fetch(`/api/contact/getonewithdetails?contactId=${contactId}`)
    const results =  await response.json()
    return results
  }
)

export const addContact = createAsyncThunk(
  'contact/addContact',
  async ({contactData}: {contactData: ContactState['addContactForm']}) => {
    const response = await fetch(`/api/contact/createone`, {
      method: 'POST',
      body: JSON.stringify({
        contactData
      })
    })
    const results =  await response.json()
    return results
  }
)

export const updateContact = createAsyncThunk(
  'contact/updateContact',
  async ({contactData}: {contactData:Contact}) => {
    const response = await fetch(`/api/contact/update?contactId=${contactData.id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    })
    const results =  await response.json()
    return results
  }
)

export const updateContactGroup = createAsyncThunk(
  'contact/updateContactGroup',
  async ({contactId, groupId, action}: Record<string,string>) => {
    const response = await fetch(`/api/contact/updategroup?contactId=${contactId}&groupId=${groupId}&action=${action}`, {
      method: 'PUT'
    })
    const results =  await response.json()
    return results
  }
)

export const updateContactManyGroup = createAsyncThunk(
  'contact/updateContactManyGroup',
  async ({contactId, groupsToUpdate}: {contactId: string, groupsToUpdate: ContactState['groupsToUpdate']}) => {
    const response = await fetch(`/api/contact/updatemanygroup`, {
      method: 'PUT',
      body: JSON.stringify({
        contactId,
        groupsToUpdate
      })
    })
    const results =  await response.json()
    return results
  }
)

export default contact.reducer