'use client'
import { getOneContact, setContactsIsLoading, setMessage, updateContactManyGroup, updateUserGroups } from '@/redux/features/contactSlice'
import { getAllGroups, setGroupsIsLoading, toggleAddGroupModal } from '@/redux/features/groupSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useEffect } from 'react'

import CircleLoader from "react-spinners/CircleLoader"

export default function ManagePreferences({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {

  const dispatch = useAppDispatch()

  const contactId = searchParams.contactId

  const { selectedContact } = useAppSelector(state => state.contact)
  const { groupsToUpdate } = useAppSelector(state => state.contact)
  const { groups } = useAppSelector(state => state.group)
  const { loading } = useAppSelector(state => state.contact)
  const { message } = useAppSelector(state => state.contact)

  useEffect(() => {

    const fetchContact = async () => {
      await dispatch(getOneContact({contactId}))
    }

    const fetchAllGroups = async () => {
      await dispatch(getAllGroups())
    }

    fetchContact()
    fetchAllGroups()
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedContact && selectedContact.id) {
      dispatch(setContactsIsLoading(true))
      await dispatch(updateContactManyGroup({
        contactId: selectedContact?.id,
        groupsToUpdate
      }))
      dispatch(setContactsIsLoading(false))
      dispatch(setMessage('Vos modifications ont été prises en compte'))
    }
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.currentTarget
    if (e.currentTarget.checked === true) {
      dispatch(updateUserGroups({
        action: 'add',
        group : groups.find(group => group.id === id)
      }))
    } else {
      dispatch(updateUserGroups({
        action: 'remove',
        group : groups.find(group => group.id === id)
      }))
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-4 p-4 items-center">
      <h1 className='text-3xl font-bold'>Gérez vos préférences</h1>
      <h2 className='text-lg font-semibold'>Email :{selectedContact?.email} - vous pouvez mettre à jour vos préférences de contact ci-dessous</h2>
      <span className=' font-light italic'>Vos données sont utilisées uniquement par Dimexoi afin de vous transmettre les informations concernant les catégories que vous avez sélectionnées</span>
      <form action="submit" onSubmit={handleSubmit} className=' flex flex-col gap-4'>

        {groups.map(group => {
          if(!group.private) {
            return (
              <div key={group.id} className='flex gap-4'>
                <input type='checkbox' id={group.id} checked={selectedContact?.groups?.find(contactGroup => contactGroup.id === group.id) ? true : false} onChange={handleCheck}/>
                <label htmlFor={group.id} className=' text-lg'>{group.nom}</label>
              </div>
            )
          }
        }
          
        )}

        <button type='submit' className='border border-black p-4 rounded-lg hover:bg-white hover:font-semibold duration-200 disabled:bg-gray-500' disabled={loading}>
          Enregistrer
        </button>
        
      </form>

      <span className='text-green-500 text-lg font-semibold'>{message}</span>
    </main>
  )
}