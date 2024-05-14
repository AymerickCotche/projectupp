'use client'

import { addAGroup, addContact, addGroupAddModal, removeAGroup, removeGroupAddModal, setEditContactForm, setInputAddContactForm, setSelectedContact, setUpdateGroupsIsLoading, toggleContactIsSaving, toggleOpenContactSavingModal, toogleAddContactModal, toogleEditContactModal, updateContactGroup } from '@/redux/features/contactSlice'
import { addGroup, getAllGroups, setGroupsIsLoading, setInputAddGroupForm, toggleAddGroupModal } from '@/redux/features/groupSlice'
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

const AddGroupModal = () => {

  const dispatch = useAppDispatch()

  const { openModalSaving } = useAppSelector(state => state.display)
  const { loading } = useAppSelector(state => state.group)
  const { addGroupForm } = useAppSelector(state => state.group)
  const { groups } = useAppSelector(state => state.group)


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
    dispatch(setInputAddGroupForm({name: 'nom', value: ''}))
    dispatch(toggleAddGroupModal())
  }

  const handleChangeAddGroupForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if (name === 'nom') {
      dispatch(setInputAddGroupForm({name, value}))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(toggleIsSaving())
    dispatch(toggleOpenModalSaving())
    await dispatch(addGroup({
      groupData : addGroupForm
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

          <h2 className='text-center text-lg'>Ajouter un Groupe</h2>

          <form action="submit" onSubmit={handleSubmit}>

            <div className='flex flex-col gap-2 mb-2'>
              <label htmlFor="groupName">
                Nom :
              </label>
              <input type="text" id="groupName" name="nom" className='border border-black rounded p-2' value={addGroupForm.nom} onChange={handleChangeAddGroupForm}/>
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

export default AddGroupModal