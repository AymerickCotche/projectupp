'use client'

import { addToCampaignGroups, addToCampaignGroupsEditModal, removeToCampaignGroups, resetAddCampaignForm, resetEditCampaignForm, saveCampaign, setAddCampaignError, setAddCampaignForm, setEditCampaignError, setEditCampaignForm, toggleEditCampaignModal, updateCampaign } from '@/redux/features/campaignSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import dynamic from 'next/dynamic'
import React, { useEffect} from 'react'
const Editor = dynamic(() => import('@/app/components/CompEmailEditor'),  { ssr: false });
import PickDateAndTime from './PickDateAndTime'
import { getAllGroups, setGroupsIsLoading } from '@/redux/features/groupSlice'
import { emailText, saveEmailtext, updateEmailtext } from '@/redux/features/emailTextSlice'
import SavingModal from './savingModal'
import { toggleOpenModalSaving, toggleIsSaving } from '@/redux/features/displaySlice'
import PickDateAndTimeEdit from './PickDateAndTimeEdit'

interface Group {
  id: string
  nom: string
}

const EditCampaignModal = () => {

  const dispatch = useAppDispatch()

  const { updateGroupsLoading } = useAppSelector(state => state.contact)
  const allGroups = useAppSelector(state => state.group.groups)
  const { selectedCampaign } = useAppSelector(state => state.campaign)
  const { campaigns } = useAppSelector(state => state.campaign)
  const { isSaving } = useAppSelector(state => state.display)
  const { openModalSaving } = useAppSelector(state => state.display)

  const campaignGroups = selectedCampaign?.groups

  const { editCampaignForm } = useAppSelector(state => state.campaign)
  const { editCampaignError } = useAppSelector(state => state.campaign)

  const availablesGroups = allGroups.filter(group => 
    !editCampaignForm.groups!.some(addedGroup => addedGroup.id === group.id)
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
    const foundCampaign = campaigns.find(campaign => campaign.nom === editCampaignForm.nom)
    if (foundCampaign && foundCampaign.id !== editCampaignForm.id) {
      dispatch(setEditCampaignError({
        name: 'nomError',
        value: true
      }))
    } else {
      if (editCampaignError.nomError === true) {
        dispatch(setAddCampaignError({
          name: 'nomError',
          value: false
        }))
      }
    }

  }, [dispatch, editCampaignForm.nom, editCampaignError.nomError, campaigns])

  const handleClickCloseModal = () => {
    dispatch(toggleEditCampaignModal(false))
    dispatch(resetEditCampaignForm())
  }

  const handleChangeEditCampaignForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if (name === 'nom' || name === 'description' || name === 'date' || name === 'emailObject') {
      dispatch(setEditCampaignForm({name, value}))
    }
  }

  const handleClickAddGroup = async (e: React.MouseEvent<HTMLButtonElement>, group: Group) => {
    e.preventDefault()
    dispatch(addToCampaignGroupsEditModal(group))
  }

  const handleClickRemoveGroup = async (group: Group) => {
    dispatch(removeToCampaignGroups(group))
  }

  // const handleClickSaveNewCampaign = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()

   
  //   if(editCampaignForm.nom && editCampaignForm.date && editCampaignForm.emailTextHtml && editCampaignForm.groups && editCampaignForm.description) {

  //     dispatch(toggleOpenModalSaving())
  //     dispatch(toggleIsSaving())
  //     const savedEmailText = await dispatch(saveEmailtext({
  //       emailTextName: editCampaignForm.nom,
  //       emailTextContent: editCampaignForm.emailTextHtml
  //     }))

  //     await dispatch(saveCampaign({
  //       campaignName: editCampaignForm.nom,
  //       campaignDate: editCampaignForm.date,
  //       campaignDescription: editCampaignForm.description,
  //       emailTextId: savedEmailText.payload.id,
  //       campaignGroups: editCampaignForm.groups.map(group => {
  //         return {
  //           id: group.id
  //         }
  //       })
  //     }))

  //     dispatch(toggleIsSaving())
  //   }
  // }

  const handeClickEditCampaign = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(toggleOpenModalSaving())
    dispatch(toggleIsSaving())

    if(editCampaignForm.nom && editCampaignForm.date && editCampaignForm.emailObject && editCampaignForm.emailTextHtml && editCampaignForm.groups && editCampaignForm.description &&  editCampaignForm.emailTextDesign &&  editCampaignForm.id &&  editCampaignForm.emailTextId) {

      await dispatch(updateEmailtext({
        emailTextName: editCampaignForm.emailObject,
        emailTextContent: editCampaignForm.emailTextHtml,
        emailTextDesign: editCampaignForm.emailTextDesign,
        emailTextId: editCampaignForm.emailTextId,
      }))

      await dispatch(updateCampaign({
        campaignId: editCampaignForm.id,
        campaignName: editCampaignForm.nom,
        campaignDate: editCampaignForm.date,
        campaignDescription: editCampaignForm.description,
        campaignGroups: editCampaignForm.groups.map(group => {
          return {
            id: group.id
          }
        })
      }))

      dispatch(toggleIsSaving())
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-2'>
        <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-h-full overflow-auto">
          <button
            onClick={handleClickCloseModal}
            className="text-black bg-transparent hover:bg-gray-200 rounded-md p-2 absolute top-2 right-2"
          >
            Fermer
          </button>



              <h2>Modifier une campagne</h2>

              <div className='overflow-y-auto'>

                {
                  editCampaignForm.emailTextDesign && 
                  <div>
                  <Editor design={editCampaignForm.emailTextDesign}/>
                </div>
                }

                {
                  !editCampaignForm.emailTextDesign && 
                  <div className='text-center text-red-800 underline font-bold text-lg'>
                  Email non éditable car ancienne version de mail de UPP
                  </div>
                }

                <form action="">

                  <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="campaignName">
                      Nom : <span className='text-red-600'>{editCampaignError.nomError ? 'Nom déjà utilisé' : ''}</span>
                    </label>
                    <input required type="text" id="campaignName" name="nom" className={`border border-black rounded p-2 ${editCampaignError.nomError ? ' focus:outline-red-500' : ''} ${editCampaignError.nomError ? ' border-red-500' : ''}`} value={editCampaignForm.nom ? editCampaignForm.nom : ''} onChange={handleChangeEditCampaignForm}/>
                  </div>

                  <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="emailObject">
                      Objet email : <span className='text-red-600'>{editCampaignError.emailObjectError ? 'Obligatoire' : ''}</span>
                    </label>
                    <input required type="text" id="emailObject" name="emailObject" className={`border border-black rounded p-2 ${editCampaignError.emailObjectError ? ' focus:outline-red-500' : ''} ${editCampaignError.emailObjectError? ' border-red-500' : ''}`} value={editCampaignForm.emailObject ? editCampaignForm.emailObject : ''} onChange={handleChangeEditCampaignForm}/>
                  </div>

                  <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="campaignDesc">
                      Description :
                    </label>
                    <input required type="text" id="campaignDesc" name="description" className='border border-black rounded p-2' value={editCampaignForm.description ? editCampaignForm.description : ''} onChange={handleChangeEditCampaignForm}/>
                  </div>

                  <div className={`${editCampaignForm.date && Date.parse(editCampaignForm.date) < new Date().getTime() ? 'text-red-500' : ''} mb-2`}>
                    <span>
                      Date : {editCampaignForm.date && Date.parse(editCampaignForm.date) < new Date().getTime() &&
                        <span>La date doit être dans le futur ...</span>
                      }
                    </span>

                    <div className={`border border-black rounded p-2 ${editCampaignForm.date && Date.parse(editCampaignForm.date) < new Date().getTime() ? 'border-red-500' : ''}`}>

                      <PickDateAndTimeEdit/>
                      

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
                        editCampaignForm.groups?.map(group => (
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

                  <button className={`border border-black p-2 rounded hover:bg-black hover:text-white hover:border-white duration-200 disabled:bg-gray-600 disabled:hover:bg-gray-700 disabled:hover:text-black`} disabled={editCampaignError.nomError} onClick={handeClickEditCampaign}>
                    Mettre à jour
                  </button>
                  
                </form>
              </div>

            </div>


        {openModalSaving && 
          <SavingModal/>
        }
    </div>
  )
}

export default EditCampaignModal