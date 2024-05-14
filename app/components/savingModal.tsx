'use client'

import { toggleOpenModalSaving } from '@/redux/features/displaySlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import React, { useEffect } from 'react'
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

const SavingModal = () => {

  const dispatch = useAppDispatch()

  const { isSaving } = useAppSelector(state => state.display)

  const handleClickCloseModal = () => {
    dispatch(toggleOpenModalSaving())
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

          {
            isSaving &&

            <div>
              <h3>Enregistrement en cours</h3>
              <h3>Veuillez patienter</h3>
            </div>
          }

          {
            !isSaving &&

            <div>
              <h3>Enregistrement terminé</h3>
              <h3>voir ici</h3>
            </div>
          }
          
        </div>
    </div>
  )
}

export default SavingModal