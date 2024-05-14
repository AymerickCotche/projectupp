'use client'

import { addAGroup, removeAGroup, setContactsIsLoading, setEditContactForm, setSelectedContact, setSelectedContactEdit, setUpdateGroupsIsLoading, toogleEditContactModal, updateContact, updateContactGroup } from '@/redux/features/contactSlice'
import { getAllGroups, setGroupsIsLoading } from '@/redux/features/groupSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import CircleLoader from "react-spinners/CircleLoader"

interface Group {
  id: string
  nom: string
}

interface Contact {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  createdAt: string
  groups: Group[]
}

const EditContactModal = () => {

  const dispatch = useAppDispatch()

  const selectedContact = useAppSelector(state => state.contact.selectedContactEdit)
  const {editContactForm} = useAppSelector(state => state.contact)
  const {loading: contactLoading} = useAppSelector(state => state.contact)
  const { loading } = useAppSelector(state => state.group)
  const { updateGroupsLoading } = useAppSelector(state => state.contact)
  const groups = useAppSelector(state => state.group.groups)
  const { updateMessage } = useAppSelector(state => state.contact)

  const contactGroups = selectedContact?.groups

  const availablesGroups = groups.filter(group => 
    !contactGroups!.some(joinedGroup => joinedGroup.id === group.id)
);



  useEffect(() => {
    const fetchAllGroups = async () => {
      dispatch(setGroupsIsLoading(true))
      await dispatch(getAllGroups())
      dispatch(setGroupsIsLoading(false))
    }

    fetchAllGroups()

  }, [dispatch])

  const handleClickAddGroup = async (group: Group) => {
    dispatch(setUpdateGroupsIsLoading(true))
    await dispatch(updateContactGroup({groupId: group.id, contactId: selectedContact!.id, action: 'add'}))
    dispatch(setUpdateGroupsIsLoading(false))
    dispatch(addAGroup(group))
  }

  const handleClickRemoveGroup = async (group: Group) => {
    dispatch(setUpdateGroupsIsLoading(true))
    await dispatch(updateContactGroup({groupdId: group.id, contactId: selectedContact!.id, action: 'remove'}))
    dispatch(setUpdateGroupsIsLoading(false))
    dispatch(removeAGroup(group))
  }

  const handleClickCloseModal = () => {
    dispatch(setEditContactForm({name: 'nom', value: ''}))
    dispatch(setEditContactForm({name: 'prenom', value: ''}))
    dispatch(setEditContactForm({name: 'email', value: ''}))
    dispatch(setEditContactForm({name: 'telephone', value: ''}))
    dispatch(setSelectedContactEdit(null))
    dispatch(toogleEditContactModal(false))
  }

  const handleChangeEditContactForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if (name === 'nom' || name === 'prenom' || name === 'email' || name === 'telephone') {
      dispatch(setEditContactForm({name, value}))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedContact) {
      dispatch(setContactsIsLoading(true))
      
      await dispatch(updateContact({contactData: {
        id: selectedContact?.id,
        nom: editContactForm.nom,
        prenom: editContactForm.prenom,
        email: editContactForm.email,
        telephone: editContactForm.telephone,
      }}))
      dispatch(setContactsIsLoading(false))

    }
  } 

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <button
            onClick={handleClickCloseModal}
            className="text-black bg-transparent hover:bg-gray-200 rounded-md p-2 absolute top-2 right-2"
          >
            Fermer
          </button>

          <h2>{selectedContact?.nom}</h2>

          <form action="submit" onSubmit={handleSubmit}>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactNom">
                Nom :
              </label>
              <input type="text" id="contactNom" name="nom" className='border border-black rounded p-2' value={editContactForm.nom !== '' ? editContactForm.nom : selectedContact?.nom} onChange={handleChangeEditContactForm}/>
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactPrenom">
                Prenom :
              </label>
              <input type="text" id="contactPrenom" name="prenom" className='border border-black rounded p-2' value={editContactForm.prenom !== '' ? editContactForm.prenom : selectedContact?.prenom} onChange={handleChangeEditContactForm}/>
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactEmail">
                Email :
              </label>
              <input type="text" id="contactEmail" name="email" className='border border-black rounded p-2' value={editContactForm.email !== '' ? editContactForm.email : selectedContact?.email} onChange={handleChangeEditContactForm}/>
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactTelephone">
                Téléphone :
              </label>
              <input type="text" id="contactTelephone" name="telephone" className='border border-black rounded p-2' value={editContactForm.telephone !== '' ? editContactForm.telephone : selectedContact?.telephone} onChange={handleChangeEditContactForm}/>
            </div>

            <div className='flex w-full bg-gray-200 p-2'>

              <div className='w-1/2'>
                <h3 className='mb-3'>Groupes disponibles</h3>

                {
                  loading &&
                  <div className='flex flex-col items-center justify-center p-5'>
                    <span className='mb-6'>Récupération des données en cours</span>
                    <CircleLoader color="#36d7b7" size={40}/>
                  </div>

                }

                { !loading &&
                  availablesGroups.length > 0 &&
                  
                  <ul className='flex flex-col gap-1'>
                    {availablesGroups.map(group => (
                      <li onClick={() => handleClickAddGroup(group)} key={group.id}>
                        <button className='inline-flex gap-2 bg-white border hover:bg-green-200 hover:cursor-pointer duration-300 border-gray-400 text-sm px-2 py-1' disabled={updateGroupsLoading}>
                          <span className=''>
                            {group.nom}
                          </span>

                          {
                            !updateGroupsLoading &&

                            <span>
                              --&gt;
                            </span>

                          }

                          {
                            updateGroupsLoading &&
                            <div>
                              <CircleLoader color="#36d7b7" size={15} />
                            </div>
                          }
                        </button>
                      </li>
                    ))}
                  </ul>
                }

                {groups.length === 0 &&
                  
                  <span>{selectedContact?.prenom} ne peut être ajouté à aucun groupe actuellement</span>
                }
                
              </div>
              
              <div className='w-[2px] bg-black'>

              </div>

              <div className='w-1/2 text-center'>

              <h3 className='mb-3'>Groupes déjà ajoutés</h3>
                {contactGroups && contactGroups?.length > 0 &&
                
                  <ul className='flex flex-col gap-1'>
                    {contactGroups?.map(group => (
                      <li onClick={() => handleClickRemoveGroup(group)} key={group.id}>
                        <button className='inline-flex gap-2 bg-white border hover:bg-red-200 hover:cursor-pointer duration-300 border-gray-400 text-sm px-2 py-1' disabled={updateGroupsLoading}>
                          <span className=''>
                            {group.nom}
                          </span>

                          {
                            !updateGroupsLoading &&

                            <span className=''>
                              X
                            </span>

                          }

                          {
                            updateGroupsLoading &&
                            
                            <div>

                              <CircleLoader color="#36d7b7" size={15}/>
                            </div>
                          }
                          
                        </button>
                      </li>
                      ))}
                  </ul>
                }

                {contactGroups?.length === 0 &&
                  
                  <span className='text-red-500'>{selectedContact?.prenom} n&apos;est dans aucun groupe actuellement</span>
                }
                
              </div>
            </div>
            <span className='text-green-600 text-lg font-bold'>{updateMessage}</span>
            <button className='border border-black rounded p-2 hover:bg-black hover:text-white duration-150 mt-2 mx-auto w-full' type='submit'>
              {contactLoading && 
              
              <CircleLoader/>}
              {!contactLoading && 
              
              <span>Enregistrer</span>}
            </button>
          </form>
        </div>
    </div>
  )
}

export default EditContactModal