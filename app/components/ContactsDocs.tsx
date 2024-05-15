'use client'

import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { campaign, getAllCampaigns } from '@/redux/features/campaignSlice'
import { getAllContacts } from '@/redux/features/contactSlice'
import { getContactsDocument, setDisplayedDocs, setPage } from '@/redux/features/contactsDocumentSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { CircleLoader } from 'react-spinners'

const formateDate = (dateString: string) => {

  if (dateString) {

    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Mois commence à 0
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } else {
    return '--'
  }
}

function ContactsDocs() {

  const dispatch = useAppDispatch()

  const { docs, loading, page, displayedDocs} = useAppSelector(state => state.contactsDocument)

  useEffect(() => {

    const fetchContactsDocs = async () => {
      await dispatch(getContactsDocument(1))
    }

    fetchContactsDocs()

  }, [])

  useEffect(() => {

    if (docs.length > 0) {
      dispatch(setDisplayedDocs(_.orderBy(docs, 'invoiceDateTimeStamp', 'desc').slice((page - 1) * 20, page * 20)))
    }

  }, [dispatch, docs, page])

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1))
    }
  }

  const handleNextPage = () => {
    if (page < docs.length / 20) {
      dispatch(setPage(page + 1))
    }
  }

  return (
    <div>
      <h2 className='mb-4 text-center text-lx font-semibold'>Documents par contact</h2>

      {
          loading &&
            <div className='flex flex-col items-center justify-center p-5'>
              <span className='mb-6'>Récupération des données en cours</span>
              <CircleLoader color="#36d7b7" />
            </div>
        }

        {!loading &&
          <>
          <div className='flex gap-2'>
            <span className='hover:cursor-pointer' onClick={handlePrevPage}>
              &lt;&lt;
            </span>
            <span className='border border-black px-1'>
              {page}
            </span>
            <span className='hover:cursor-pointer' onClick={handleNextPage}>
              &gt;&gt;
            </span>
            <span>20 résultats par pages</span>
          </div>
            <div className='grid grid-cols-7 text-blue-500'>
              <span>Date</span>
              <span>Document</span>
              <span>Client</span>
              <span>Email</span>
              <span>Montant </span>
              <span>Campagnes J-7 --&gt; J</span>
              <span>Demandes</span>
            </div>

            {displayedDocs.map(doc => <div key={doc.id} className='grid grid-cols-7 p-1 border-b-2 border-blue-500'>
              <span className='flex items-center'>{formateDate(doc.date)}</span>
              <span className='flex items-center'>{doc.docName}</span>
              <span className='flex items-center'>{doc.contact.nom}</span>
              <span className='flex items-center'>{doc.contact.email}</span>
              <span className='flex items-center'>{doc.montant}</span>
              <span>{doc.campagnes}</span>
              <div className=' overflow-x-auto flex gap-1'>
                
                {doc.contact.demandes ? doc.contact.demandes.map(demande =>
                <div key={demande.id} className='w-auto'>
                  <p className="whitespace-nowrap after:content-['|']">{formateDate(demande.createdAt)} {demande.content}</p>
                  
                </div>
                ) : ''}
              </div>
            </div>)}
          </>
        }
      
      


    </div>
  )
}

export default ContactsDocs