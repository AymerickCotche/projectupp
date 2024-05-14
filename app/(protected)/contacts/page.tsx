'use client'

import { ButtonHTMLAttributes, useEffect, useMemo, useState } from 'react'
import EditContactModal from '../../components/EditContactModal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getAllContacts, getOneContactWithAllDetails, setContactsIsLoading, setLoadingContactDetails, setSearchContactInput, setSearchContactTerm, setSelectedContact, setSelectedContactEdit, setSelectedIdDetails, toggleContactDetails, toogleAddContactModal, toogleEditContactModal } from '@/redux/features/contactSlice'
import CircleLoader from "react-spinners/CircleLoader"
import AddContactModal from '../../components/AddContactModal'
import DetailsContact from '@/app/components/DetailsContact'
import { toggleShowFilterComp } from '@/redux/features/displaySlice'
import Filter from '@/app/components/Filter'

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
    createdAt?: string
    groups?: Group[]
}

export default function Contact() {

  const dispatch = useAppDispatch()

  const { contacts } = useAppSelector(state => state.contact)
  const { loading } = useAppSelector(state => state.contact)
  const editContactModal = useAppSelector(state => state.contact.editContactModal)
  const { addContactModal } = useAppSelector(state => state.contact)
  const selectedContact = useAppSelector(state => state.contact.selectedContact)
  const { showContactDetails } = useAppSelector(state => state.contact)
  const { selectedIdDetails } = useAppSelector(state => state.contact)
  const { searchContactInput } = useAppSelector(state => state.contact)
  const { searchContactTerm } = useAppSelector(state => state.contact)
  const { loadingContactDetails } = useAppSelector(state => state.contact)
  const { showFilterComp } = useAppSelector(state => state.display)

  const openModalWithContact = (contact: Contact) => {
      dispatch(setSelectedContactEdit(contact))
      dispatch(toogleEditContactModal(true))
  }

  const handleClickAddContact = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(toogleAddContactModal(true))
  }

  const addGroupToContact = (group: Group) => {
      if (selectedContact) {
        if (selectedContact.groups) {

          if (selectedContact.groups.find(g => g.id === group.id)) {
              // Le groupe est déjà associé au contact, ne rien faire
              return;
          }
          setSelectedContact({
              ...selectedContact,
              groups: [...selectedContact.groups, group]
          });
        }

      }
  }

  useEffect(() => {

      const fetchContacts = async () => {
          dispatch(setContactsIsLoading(true))
          await dispatch(getAllContacts())
          dispatch(setContactsIsLoading(false))
      }

      fetchContacts()

  }, [dispatch])

  const handleClickContactDetails = async (contactId: string) => {
    // console.log(contactId);
    if (selectedIdDetails && selectedIdDetails === contactId) {
      dispatch(toggleContactDetails())
    }
    if (selectedIdDetails === "" && !showContactDetails) {
      dispatch(setSelectedIdDetails(contactId))
      dispatch(toggleContactDetails())
      dispatch(setLoadingContactDetails(true))
      await dispatch(getOneContactWithAllDetails({contactId}))
      dispatch(setLoadingContactDetails(false))
    }

    if (selectedIdDetails && !showContactDetails){
      dispatch(toggleContactDetails())
      dispatch(setLoadingContactDetails(true))
      await dispatch(getOneContactWithAllDetails({contactId}))
      dispatch(setLoadingContactDetails(false))
    }

    if (selectedIdDetails && selectedIdDetails !== contactId && showContactDetails){
      dispatch(setSelectedIdDetails(contactId))
      dispatch(setLoadingContactDetails(true))
      await dispatch(getOneContactWithAllDetails({contactId}))
      dispatch(setLoadingContactDetails(false))
    }

  }

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchContactInput(e.currentTarget.value))
  }

  const displayedContacts = useMemo(() => {
    return searchContactTerm
        ? contacts.filter(item => 
            item.email.toLowerCase().includes(searchContactTerm.toLowerCase()))
        : contacts;
  }, [contacts, searchContactTerm]);


  const onSearchChange = () => {
    dispatch(setSearchContactTerm(searchContactInput))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
        onSearchChange()
    }, 300); // Retard de 300 ms

    return () => clearTimeout(timer)
  }, [searchContactInput, onSearchChange]);

  const formateDate = (dateString: string | undefined) => {

    if (dateString && dateString !== undefined) {

      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // Mois commence à 0
      const year = date.getFullYear()
  
      return `${day}/${month}/${year}`
    } else {
      return '--'
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <h2 className='text-2xl mb-4'>LES CONTACTS</h2>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center '>
          <div className='p-2 bg-gray-500'>
            <span onClick={() => dispatch(toggleShowFilterComp())} className='hover:cursor-pointer'>filtrer</span>
          </div>
          <div>
            <input className='p-2' type="text" placeholder='Rechercher' onChange={handleChangeSearchInput} value={searchContactInput}/>
          </div>
        </div>
        
        <div>
          <button onClick={handleClickAddContact} className='bg-green-300 p-2'>
            Créer contact
          </button>
        </div>
      </div>
      {
        showFilterComp &&
        <Filter entity={'contact'}/>
      }
      <div className="">
        <div className='grid grid-cols-5 border-b border-black mb-2' >
          <span>nom</span>
          <span>prenom</span>
          <span>email</span>
          <span>date d&apos;ajout</span>
          <span>action</span>
        </div>

        { !loading &&
          displayedContacts.map(contact => (
            <div key={contact.id}>

              <div className={`grid grid-cols-5 ${selectedIdDetails === contact.id ? 'bg-gray-100 border border-gray-300 p-2' : ''}`}>
                <span onClick={() => handleClickContactDetails(contact.id)} className='hover:cursor-pointer'>{contact.nom}</span>
                <span onClick={() => handleClickContactDetails(contact.id)} className='hover:cursor-pointer'>{contact.prenom}</span>
                <span onClick={() => handleClickContactDetails(contact.id)} className='hover:cursor-pointer'>{contact.email}</span>
                <span onClick={() => handleClickContactDetails(contact.id)} className='hover:cursor-pointer'>{formateDate(contact?.createdAt)}</span>
                <span onClick={() => openModalWithContact(contact)}>modifier</span>
              </div>

              {showContactDetails && contact.id === selectedIdDetails && loadingContactDetails &&
                <div className='p-4 border border-gray-300 bg-white flex flex-col justify-center align-middle items-center'>

                  <CircleLoader color="#36d7b7" />
                  <p className='mt-5'>Récupération des détails du contact</p>
                </div>
              }

              {showContactDetails && contact.id === selectedIdDetails && !loadingContactDetails &&
                <DetailsContact/>
              }
            </div>
              
          ))
        }

        {
          loading &&
            <div className='flex flex-col items-center justify-center p-5'>
              <span className='mb-6'>Récupération des données en cours</span>
              <CircleLoader color="#36d7b7" />
            </div>
        }
          
          
      </div>
      
      {
          editContactModal &&

          <EditContactModal/>

      }

      {
          addContactModal &&

          <AddContactModal/>

      }
      
    </main>
  )
}
