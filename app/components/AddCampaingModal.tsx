'use client'

import { addToCampaignGroups, campaign, removeToCampaignGroups, resetAddCampaignForm, saveCampaign, setAddCampaignError, setAddCampaignForm, toogleAddCampaignModal } from '@/redux/features/campaignSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import dynamic from 'next/dynamic'
import React, { useEffect, useState} from 'react'
const Editor = dynamic(() => import('@/app/components/CompEmailEditor'),  { ssr: false });
import PickDateAndTime from './PickDateAndTime'
import { getAllGroups, setGroupsIsLoading } from '@/redux/features/groupSlice'
import { saveEmailtext } from '@/redux/features/emailTextSlice'
import SavingModal from './savingModal'
import { toggleOpenModalSaving, toggleIsSaving } from '@/redux/features/displaySlice'
import SelectEmailDesign from './SelectEmailDesign'

interface Group {
  id: string
  nom: string
}

const AddCampaignModal = () => {

  const dispatch = useAppDispatch()

  const { loading } = useAppSelector(state => state.group)
  const { updateGroupsLoading } = useAppSelector(state => state.contact)
  const allGroups = useAppSelector(state => state.group.groups)
  const { selectedCampaign } = useAppSelector(state => state.campaign)
  const { campaigns } = useAppSelector(state => state.campaign)
  const { isSaving } = useAppSelector(state => state.display)
  const { openModalSaving } = useAppSelector(state => state.display)

  const campaignGroups = selectedCampaign?.groups

  const addCampaignForm = useAppSelector(state => state.campaign.addCampaignForm)
  const {addCampaignError} = useAppSelector(state => state.campaign)

  const { selectedEmailText } = useAppSelector(state => state.emailText)

  const availablesGroups = allGroups.filter(group => 
    !addCampaignForm.groups!.some(addedGroup => addedGroup.id === group.id)
  )

  useEffect(() => {
    const fetchAllGroups = async () => {
      dispatch(setGroupsIsLoading(true))
      await dispatch(getAllGroups())
      dispatch(setGroupsIsLoading(false))
    }

    fetchAllGroups()

  }, [dispatch])

  useEffect(() => {
    if (campaigns.find(campaign => campaign.nom === addCampaignForm.nom)) {
      dispatch(setAddCampaignError({
        name: 'nomError',
        value: true
      }))
    } else {
      if (addCampaignError.nomError === true) {
        dispatch(setAddCampaignError({
          name: 'nomError',
          value: false
        }))
      }
    }

  }, [dispatch, addCampaignForm.nom, addCampaignError.nomError, campaigns])
  

  const handleClickCloseModal = () => {
    dispatch(toogleAddCampaignModal(false))
    dispatch(resetAddCampaignForm())
  }

  const handleChangeAddCampaignForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if (name === 'nom' || name === 'description' || name === 'date' || name === 'emailObject') {
      dispatch(setAddCampaignForm({name, value}))
    }
  }

  const handleClickAddGroup = async (e: React.MouseEvent<HTMLButtonElement>, group: Group) => {
    e.preventDefault()
    dispatch(addToCampaignGroups(group))
  }

  const handleClickRemoveGroup = async (group: Group) => {
    dispatch(removeToCampaignGroups(group))
  }

  const handleClickSaveNewCampaign = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

   
    if(addCampaignForm.nom && addCampaignForm.date && addCampaignForm.emailObject && addCampaignForm.emailTextHtml && addCampaignForm.emailTextDesign&& addCampaignForm.groups && addCampaignForm.description) {

      dispatch(toggleOpenModalSaving())
      dispatch(toggleIsSaving())
      
      const savedEmailText = await dispatch(saveEmailtext({
        emailTextName: addCampaignForm.emailObject,
        emailTextContent: addCampaignForm.emailTextHtml,
        emailTextDesign: addCampaignForm.emailTextDesign
      }))

      await dispatch(saveCampaign({
        campaignName: addCampaignForm.nom,
        campaignDate: addCampaignForm.date,
        campaignDescription: addCampaignForm.description,
        emailTextId: savedEmailText.payload.id,
        campaignGroups: addCampaignForm.groups.map(group => {
          return {
            id: group.id
          }
        })
      }))

      dispatch(toggleIsSaving())
    }
  }

  const [key, setKey] = useState(0);

  useEffect(() => {
    // Action à effectuer, par exemple, recharger un composant ou faire une requête

    // Forcer le rechargement du composant en changeant sa clé
    setKey(prevKey => prevKey + 1);
  }, [selectedEmailText]); // Dépendances de l'effet

  return (

        <div className="bg-white p-4 rounded-lg shadow-lg mb-4">


          <h2>Créer une nouvelle campagne</h2>

          <SelectEmailDesign/>

          <div>

            <div>
              <Editor key={key} design={selectedEmailText?.design}/>
            </div>

            <form action="">

              <div className='flex flex-col gap-2 mb-2'>
                <label htmlFor="campaignName">
                  Nom campagne : <span className='text-red-600'>{addCampaignError.nomError ? 'Nom déjà utilisé' : ''}</span>
                </label>
                <input required type="text" id="campaignName" name="nom" className={`border border-black rounded p-2 ${addCampaignError.nomError ? ' focus:outline-red-500' : ''} ${addCampaignError.nomError ? ' border-red-500' : ''}`} value={addCampaignForm.nom ? addCampaignForm.nom : ''} onChange={handleChangeAddCampaignForm}/>
              </div>

              <div className='flex flex-col gap-2 mb-2'>
                <label htmlFor="emailObject">
                  Objet email : <span className='text-red-600'>{addCampaignError.emailObjectError ? 'Obligatoire' : ''}</span>
                </label>
                <input required type="text" id="emailObject" name="emailObject" className={`border border-black rounded p-2 ${addCampaignError.emailObjectError ? ' focus:outline-red-500' : ''} ${addCampaignError.emailObjectError ? ' border-red-500' : ''}`} value={addCampaignForm.emailObject ? addCampaignForm.emailObject : ''} onChange={handleChangeAddCampaignForm}/>
              </div>

              <div className='flex flex-col gap-2 mb-2'>
                <label htmlFor="campaignDesc">
                  Description campagne :
                </label>
                <input required type="text" id="campaignDesc" name="description" className='border border-black rounded p-2' value={addCampaignForm.description ? addCampaignForm.description : ''} onChange={handleChangeAddCampaignForm}/>
              </div>

              <div className={`${addCampaignForm.date && Date.parse(addCampaignForm.date) < new Date().getTime() ? 'text-red-500' : ''} mb-2`}>
                <span>
                  Date : {addCampaignForm.date && Date.parse(addCampaignForm.date) < new Date().getTime() &&
                    <span>La date doit être dans le futur ...</span>
                  }
                </span>

                <div className={`border border-black rounded p-2 ${addCampaignForm.date && Date.parse(addCampaignForm.date) < new Date().getTime() ? 'border-red-500' : ''}`}>

                  <PickDateAndTime/>
                  

                </div>

              </div>

              <div className='flex gap-2 mb-2'>
                <span>Groupes disponibles : </span>
                <ul className='flex gap-2'>
                  { availablesGroups &&
                  availablesGroups?.map(group => (
                    <li key={group.id} >
                      <button className='inline-block border px-2 py-1 text-sm rounded bg-gray-300' onClick={(e) => handleClickAddGroup(e, group)}>
                        {group.nom}
                      </button>
                    </li>
                  ))}
                  { !availablesGroups &&
                    <li>Aucun groupe disponible</li>
                  }
                </ul>
              </div>

              <div className='flex gap-2'>
                <span>Groupes ajoutés : </span>
                <ul className='flex gap-1'>
                    {selectedCampaign &&
                    campaignGroups?.map(group => (
                      <li onClick={() => handleClickRemoveGroup(group)} key={group.id}>
                        <button className='inline-flex gap-2 bg-white border hover:bg-red-200 hover:cursor-pointer duration-300 border-gray-400 text-sm px-2 py-1' disabled={updateGroupsLoading}>
                          <span className=''>
                            {group.nom}
                          </span>

                          <span className=''>
                            X
                          </span>
                          
                        </button>
                      </li>
                      ))}

                    {!selectedCampaign &&
                    addCampaignForm.groups?.map(group => (
                      <li onClick={() => handleClickRemoveGroup(group)} key={group.id}>
                        <button className='inline-flex gap-2 bg-white border hover:bg-red-200 hover:cursor-pointer duration-300 border-gray-400 text-sm px-2 py-1' disabled={updateGroupsLoading}>
                          <span className=''>
                            {group.nom}
                          </span>

                          <span className=''>
                            X
                          </span>
                          
                        </button>
                      </li>
                      ))}
                  </ul>
              </div>

              <button className={`border border-black p-2 rounded hover:bg-black hover:text-white hover:border-white duration-200 disabled:bg-gray-600 disabled:hover:bg-gray-700 disabled:hover:text-black`} disabled={addCampaignError.nomError} onClick={handleClickSaveNewCampaign}>
                Enregistrer
              </button>
              
            </form>
          </div>



        {openModalSaving && 
          <SavingModal/>
        }
    </div>
  )
}

export default AddCampaignModal