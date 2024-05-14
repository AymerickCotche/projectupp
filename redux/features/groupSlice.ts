import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface Group {
  id: string
  nom: string
  description: string
  private: boolean
  _count?: {
    contacts: number
  }
}

type GroupState = {
  groups: Group[]
  loading: boolean
  addGroupModal: boolean
  addGroupForm: {
    nom: string
  }
}

type AddGroupFormField = keyof GroupState['addGroupForm'];

interface AddGrouptFormAction {
  type: string
  payload: {
    name: AddGroupFormField
    value: string
  }
}

const initialState = {
  groups: [],
  loading: false,
  addGroupModal: false,
  addGroupForm: {
    nom: ''
  }
} as GroupState

export const group = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroupsIsLoading(state, action) {
      state.loading = action.payload
    },
    setInputAddGroupForm(state: GroupState, action: AddGrouptFormAction) {
      state.addGroupForm[action.payload.name] = action.payload.value
    },
    toggleAddGroupModal(state) {
      state.addGroupModal = !state.addGroupModal
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.groups = action.payload
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.groups = [...state.groups, action.payload]
      })
    }
})

export const {
  setGroupsIsLoading,
  toggleAddGroupModal,
  setInputAddGroupForm
} = group.actions

export const getAllGroups = createAsyncThunk(
  'group/getAllGroups',
  async () => {
    const response = await fetch(`/api/group/getall`)
    const results =  await response.json()
    return results
  }
)

export const addGroup = createAsyncThunk(
  'group/addGroup',
  async ({groupData}: {groupData: GroupState['addGroupForm']}) => {
    const response = await fetch(`/api/group/createone`, {
      method: 'POST',
      body: JSON.stringify({
        groupData
      })
    })
    const results =  await response.json()
    return results
  }
)

export default group.reducer