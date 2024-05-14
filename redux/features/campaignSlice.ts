import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface Group {
  id: string
  nom: string
}

interface EventContact {
  id: string
  nom: string
}


interface Event {
  id: string
  name: string
  eventContacts: EventContact[]
}

interface Campaign {
  id: string
  nom: string
  description: string
  schedulled: boolean
  finished: boolean
  date: string
  events: Event[]
  groups: Group[]
  cronId?: string
  totalToSend?: number
  numberSent?: number
  emailTextId: string
  emailText?: {
    id?: string
    nom: string
    content: string
    design: string
  }

}

type CampaignState = {
  campaigns: Campaign[]
  loading: boolean
  openEditCampaignModal: boolean
  openAddCampaignModal: boolean
  selectedCampaign: Campaign | null
  addCampaignForm: {
    id?: string
    nom: null | string
    description: null | string
    date: null | string
    groups: Group[] | null
    emailTextHtml: null | string
    emailTextDesign: null | string
    emailObject: null | string
  },
  editCampaignForm: {
    id: null | string
    nom: null | string
    description: null | string
    date: null | string
    groups: Group[] | null
    emailTextHtml: null | string
    emailTextDesign: null | string
    emailTextId: null | string
    emailObject: null | string
  }
  isSaving: boolean
  openSavingModal: boolean
  addCampaignError: {
    nomError: boolean
    descriptionError: boolean
    dateError: boolean
    groupsError: boolean
    emailTextHtmlError: boolean
    emailTextDesignError: boolean
    emailObjectError: boolean
  }
  editCampaignError: {
    idError: boolean
    nomError: boolean
    descriptionError: boolean
    dateError: boolean
    groupsError: boolean
    emailTextHtmlError: boolean
    emailTextDesignError: boolean
    emailObjectError: boolean
  }
  showCampaignDetails: boolean
  selectedIdDetails: string
  loadingCampaignDetail: boolean
}

type AddCampaignFormField = keyof CampaignState['addCampaignForm']
type AddCampaignErrorField = keyof CampaignState['addCampaignError']

type EditCampaignFormField = keyof CampaignState['editCampaignForm']
type EditCampaignErrorField = keyof CampaignState['editCampaignError']

interface AddCampaignFormAction {
  type: string
  payload: {
    name: AddCampaignFormField
    value: string | null
  }
}

interface AddCampaignErrorAction {
  type: string
  payload: {
    name: AddCampaignErrorField
    value: boolean
  }
}

interface EditCampaignFormAction {
  type: string
  payload: {
    name: EditCampaignFormField
    value: string | null
  }
}

interface EditCampaignErrorAction {
  type: string
  payload: {
    name: EditCampaignErrorField
    value: boolean
  }
}

const initialState = {
  campaigns: [],
  loading: false,
  openEditCampaignModal: false,
  openAddCampaignModal: false,
  selectedCampaign: null,
  isSaving: false,
  openSavingModal: false,
  addCampaignForm: {
    nom: null,
    groups: [],
    description: null,
    date: '',
    emailTextHtml: null,
    emailTextDesign: null,
    emailObject: null
  },
  addCampaignError: {
    nomError: false,
    descriptionError: false,
    dateError: false,
    groupsError: false,
    emailTextHtmlError: false,
    emailTextDesignError: false,
    emailObjectError: false
  },
  editCampaignForm: {
    id: null,
    nom: null,
    groups: [],
    description: null,
    date: '',
    emailTextHtml: null,
    emailTextDesign: null,
    emailTextId: null,
    emailObject: null
  },
  editCampaignError: {
    idError: false,
    nomError: false,
    descriptionError: false,
    dateError: false,
    groupsError: false,
    emailTextHtmlError: false,
    emailTextDesignError: false,
    emailObjectError: false
  },
  showCampaignDetails: false,
  selectedIdDetails: "",
  loadingCampaignDetail: false
} as CampaignState

export const campaign = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaignsIsLoading(state, action) {
      state.loading = action.payload
    },
    toggleEditCampaignModal(state, action) {
      state.openEditCampaignModal = action.payload
    },
    toogleAddCampaignModal(state, action) {
      state.openAddCampaignModal = action.payload
    },
    setAddCampaignForm(state: CampaignState, action: AddCampaignFormAction) {
      if (action.payload.name === 'date' || action.payload.name === 'description' || action.payload.name === 'nom' || action.payload.name === 'emailTextHtml' || action.payload.name === 'emailTextDesign' || action.payload.name === 'emailObject') {
        state.addCampaignForm[action.payload.name] = action.payload.value
      }
    },
    setAddCampaignError(state: CampaignState, action: AddCampaignErrorAction) {
      if (action.payload.name === 'dateError' || action.payload.name === 'descriptionError' || action.payload.name === 'nomError' || action.payload.name === 'emailTextHtmlError' || action.payload.name === 'emailTextDesignError' || action.payload.name === 'emailObjectError') {
        state.addCampaignError[action.payload.name] = action.payload.value
      }
    },
    setEditCampaignForm(state: CampaignState, action: EditCampaignFormAction) {
      if (action.payload.name === 'id' || action.payload.name === 'date' || action.payload.name === 'description' || action.payload.name === 'nom' || action.payload.name === 'emailTextHtml' || action.payload.name === 'emailTextDesign' || action.payload.name === 'emailTextId' || action.payload.name === 'emailObject') {
        state.editCampaignForm[action.payload.name] = action.payload.value
      }
    },
    setEditCampaignError(state: CampaignState, action: EditCampaignErrorAction) {
      if (action.payload.name === 'idError' || action.payload.name === 'dateError' || action.payload.name === 'descriptionError' || action.payload.name === 'nomError' || action.payload.name === 'emailTextHtmlError' || action.payload.name === 'emailTextDesignError' || action.payload.name === 'emailObjectError') {
        state.editCampaignError[action.payload.name] = action.payload.value
      }
    },
    addToCampaignGroups(state, action) {
      state.addCampaignForm.groups?.push(action.payload)
    },
    addToCampaignGroupsEditModal(state, action) {
      state.editCampaignForm.groups?.push(action.payload)
    },
    setEditCampaignFormGroups(state, action) {
      state.editCampaignForm.groups = [...action.payload]
    },
    removeToCampaignGroups(state, action) {
      if (state.addCampaignForm.groups) {
        state.addCampaignForm.groups = state.addCampaignForm.groups.filter(group => group.id !== action.payload.id)
      }
    },
    toggleIsSaving(state) {
      state.isSaving = !state.isSaving
    },
    toggleOpenSavingModal(state) {
      state.openSavingModal = !state.openSavingModal
    },
    toggleCampaignDetails(state) {
      state.showCampaignDetails = !state.showCampaignDetails
    },
    setSelectedIdDetails(state, action) {
      state.selectedIdDetails = action.payload
    },
    toggleSchedulledCampaign(state, action) {
      state.campaigns[action.payload].schedulled = !state.campaigns[action.payload].schedulled
    },
    setLoadingCampaignDetails(state, action) {
      state.loadingCampaignDetail = action.payload
    },
    setCronIdJob(state, action) {
      const updatedCampaign = state.campaigns.find(campaign => campaign.id === action.payload.campaignId)
      if (updatedCampaign) {
        updatedCampaign.cronId = action.payload.cronId
      }
    },
    resetAddCampaignForm(state) {
      state.addCampaignForm = initialState.addCampaignForm
    },
    resetEditCampaignForm(state) {
      state.editCampaignForm = initialState.editCampaignForm
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCampaigns.fulfilled, (state, action) => {
        state.campaigns = action.payload
      })
      .addCase(saveCampaign.fulfilled, (state, action) => {
        state.campaigns = [...state.campaigns, action.payload]
      })
      .addCase(getOneCampaignWithAllDetails.fulfilled, (state, action) => {
        state.selectedCampaign = action.payload
      })
      .addCase(disableJob.fulfilled, (state, action) => {
        console.log(action.payload);
      })
    }  
})

export const {
  setCampaignsIsLoading,
  toggleEditCampaignModal,
  toogleAddCampaignModal,
  setAddCampaignForm,
  addToCampaignGroups,
  setAddCampaignError,
  removeToCampaignGroups,
  toggleIsSaving,
  toggleOpenSavingModal,
  toggleCampaignDetails,
  setSelectedIdDetails,
  toggleSchedulledCampaign,
  setLoadingCampaignDetails,
  setCronIdJob,
  resetAddCampaignForm,
  setEditCampaignForm,
  setEditCampaignFormGroups,
  resetEditCampaignForm,
  setEditCampaignError,
  addToCampaignGroupsEditModal
} = campaign.actions

export const getAllCampaigns = createAsyncThunk(
  'campaign/getAllCampaigns',
  async () => {
    const response = await fetch(`/api/campaign/getall`)
    const results =  await response.json()
    return results
  }
)

export const getAllEmailDesigns = createAsyncThunk(
  'campaign/getAllEmailDesigns',
  async () => {
    const response = await fetch(`/api/emailtext/getall`)
    const results =  await response.json()
    return results
  }
)

export const saveCampaign = createAsyncThunk(
  'campaign/saveCampaign',
  async ({campaignName, campaignDescription, campaignDate, emailTextId, campaignGroups}:{campaignName: string, campaignDescription: string, campaignDate: string, emailTextId: string, campaignGroups: {id: string}[]}) => {
    const response = await fetch(`/api/campaign/addone`, {
      method: 'POST',
      body: JSON.stringify({
        campaignName,
        campaignDate,
        campaignDescription,
        emailTextId,
        campaignGroups,
      })
    })
    const results =  await response.json()
    return results
  }
)

export const updateCampaign = createAsyncThunk(
  'campaign/updateCampaign',
  async ({campaignId, campaignName, campaignDescription, campaignDate, campaignGroups}:{campaignId: string, campaignName: string, campaignDescription: string, campaignDate: string, campaignGroups: {id: string}[]}) => {
    const response = await fetch(`/api/campaign/update?campaignId=${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify({
        nom: campaignName,
        date: campaignDate,
        description: campaignDescription,
        groups: campaignGroups
      })
    })
    const results =  await response.json()
    return results
  }
)

export const enableJob = createAsyncThunk(
  'campaign/enableJob',
  async ({campaignId, jobDate}:{campaignId: string, jobDate: string}) => {
    const response = await fetch(`/api/easycron/createone`, {
      method: 'POST',
      body: JSON.stringify({
        campaignId,
        jobDate
      }),
      cache: 'no-cache'
      
    })
    const results =  await response.json()

    return results
  }
)

export const disableJob = createAsyncThunk(
  'campaign/disableJob',
  async ({campaignId, cronId}:{campaignId: string, cronId: string}) => {
    const response = await fetch(`/api/easycron/disableone`, {
      method: 'POST',
      body: JSON.stringify({
        campaignId,
        cronId
      }),
      cache: 'no-cache'
      
    })

    const results =  await response.json()

    return results
  }
)

export const getOneCampaignWithAllDetails = createAsyncThunk(
  'campaign/getOneCampaignWithAllDetails',
  async ({campaignId}: {campaignId: string}) => {
    const response = await fetch(`/api/campaign/getonewithdetails?campaignId=${campaignId}`)
    const results =  await response.json()
    return results
  }
)

export default campaign.reducer