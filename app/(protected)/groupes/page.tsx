'use client'
import { getAllGroups, setGroupsIsLoading, toggleAddGroupModal } from '@/redux/features/groupSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useEffect } from 'react'
import AddGroupModal from '../../components/AddGroupModal'
import CircleLoader from "react-spinners/CircleLoader"

export default function Group() {

  const dispatch = useAppDispatch()
  
  const { groups } = useAppSelector(state => state.group)
  const { loading } = useAppSelector(state => state.group)
  const { addGroupModal } = useAppSelector(state => state.group)

  useEffect(() => {

    const fetchGroups = async () => {
        dispatch(setGroupsIsLoading(true))
        await dispatch(getAllGroups())
        dispatch(setGroupsIsLoading(false))
    }

    fetchGroups()

  }, [dispatch])

  const handleClickAddGroup = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(toggleAddGroupModal())
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
        <h2 className='text-2xl mb-4'>LES GROUPES</h2>
        <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center '>
                <div className='p-2 bg-gray-500'>
                    <span>filter</span>
                </div>
                <div>
                    <input className='p-2' type="text" placeholder='Rechercher'/>
                </div>
            </div>
            <div>
                <button className='bg-green-300 p-2' onClick={handleClickAddGroup}>
                    Créer groupe
                </button>
            </div>
        </div>
        <div className="">
            <div className='grid grid-cols-4 border-b border-black mb-2' >
              <span>nom</span>
              <span>description</span>
              <span>Nb contacts</span>
            </div>
            {!loading &&
            
              groups.map(group => (
                <div key={group.id} className='grid grid-cols-4'>
                  <span>{group.nom}</span>
                  <span>{group.description}</span>
                  <span>{group._count?.contacts}</span>
                </div>
                  
              ))
            }

            {loading &&
              <div className='flex flex-col items-center justify-center p-5'>
                <span className='mb-6'>Récupération des données en cours</span>
                <CircleLoader color="#36d7b7" />
              </div>
            }
            
        </div>
        {
          addGroupModal &&

          <AddGroupModal/>

      }
    </main>
  )
}