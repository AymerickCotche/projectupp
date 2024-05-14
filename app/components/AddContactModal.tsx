'use client'

import { addAGroup, addContact, addGroupAddModal, removeAGroup, removeGroupAddModal, setEditContactForm, setInputAddContactForm, setSelectedContact, setUpdateGroupsIsLoading, toggleContactIsSaving, toggleOpenContactSavingModal, toogleAddContactModal, toogleEditContactModal, updateContactGroup } from '@/redux/features/contactSlice'
import { getAllGroups, setGroupsIsLoading } from '@/redux/features/groupSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import CircleLoader from "react-spinners/CircleLoader"
import SavingModal from './savingModal'
import { toggleIsSaving, toggleOpenModalSaving } from '@/redux/features/displaySlice'

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

const AddContactModal = () => {

  const dispatch = useAppDispatch()

  const { addContactForm } = useAppSelector(state => state.contact)
  const { openModalSaving } = useAppSelector(state => state.display)
  const { loading } = useAppSelector(state => state.group)
  const { updateGroupsLoading } = useAppSelector(state => state.contact)
  const { groups } = useAppSelector(state => state.group)

  const availablesGroups = groups.filter(group => 
    !addContactForm.groups.some(joinedGroup => joinedGroup.id === group.id)
  )

  useEffect(() => {
    const fetchAllGroups = async () => {
      dispatch(setGroupsIsLoading(true))
      await dispatch(getAllGroups())
      dispatch(setGroupsIsLoading(false))
    }

    fetchAllGroups()

  }, [dispatch])

  const handleClickAddGroup = (group: Group) => {
    dispatch(addGroupAddModal(group))
  }

  const handleClickRemoveGroup = async (group: Group) => {
    dispatch(removeGroupAddModal(group))
  }

  const handleClickCloseModal = () => {
    dispatch(setInputAddContactForm({name: 'nom', value: ''}))
    dispatch(setInputAddContactForm({name: 'prenom', value: ''}))
    dispatch(setInputAddContactForm({name: 'email', value: ''}))
    dispatch(setInputAddContactForm({name: 'telephone', value: ''}))
    dispatch(toogleAddContactModal(false))
  }

  const handleChangeAddContactForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if (name === 'nom' || name === 'prenom' || name === 'email' || name === 'telephone') {
      dispatch(setInputAddContactForm({name, value}))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(toggleIsSaving())
    dispatch(toggleOpenModalSaving())
    await dispatch(addContact({
      contactData : addContactForm
    }))
    dispatch(toggleIsSaving())
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

          <h2 className='text-center text-lg'>Ajouter un contact</h2>

          <form action="submit" onSubmit={handleSubmit}>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactNom">
                Nom :
              </label>
              <input type="text" id="contactNom" name="nom" className='border border-black rounded p-2' value={addContactForm.nom} onChange={handleChangeAddContactForm}/>
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactPrenom">
                Prenom :
              </label>
              <input type="text" id="contactPrenom" name="prenom" className='border border-black rounded p-2' value={addContactForm.prenom} onChange={handleChangeAddContactForm}/>
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactEmail">
                Email :
              </label>
              <input type="text" id="contactEmail" name="email" className='border border-black rounded p-2' value={addContactForm.email} onChange={handleChangeAddContactForm}/>
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="contactTelephone">
                Téléphone :
              </label>
              <input type="text" id="contactTelephone" name="telephone" className='border border-black rounded p-2' value={addContactForm.telephone} onChange={handleChangeAddContactForm}/>
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
                  
                  <span>Aucun groupe à ajouter</span>
                }
                
              </div>
              
              <div className='w-[2px] bg-black'>

              </div>

              <div className='w-1/2 text-center'>

              <h3 className='mb-3'>Groupes déjà ajoutés</h3>
                {addContactForm.groups && addContactForm.groups.length > 0 &&
                
                  <ul className='flex flex-col gap-1'>
                    {addContactForm.groups?.map(group => (
                      <li onClick={() => handleClickRemoveGroup(group)} key={group.id}>
                        <button className='inline-flex gap-2 bg-white border hover:bg-red-200 hover:cursor-pointer duration-300 border-gray-400 text-sm px-2 py-1'>
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
                }

                {addContactForm.groups?.length === 0 &&
                  
                  <span className='text-red-500'>Aucun groupe n&apos;est disponible</span>
                }
                
              </div>
            </div>

            <button className='border border-black rounded p-2 w-full mt-3 hover:bg-gray-200 duration-200'>
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

export default AddContactModal