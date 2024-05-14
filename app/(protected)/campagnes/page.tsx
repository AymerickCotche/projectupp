'use client'

import { useEffect, useState } from 'react'
import CircleLoader from "react-spinners/CircleLoader"
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import AddCampaignModal from '../../components/AddCampaingModal'
import { addToCampaignGroups, campaign, disableJob, enableJob, getAllCampaigns, getOneCampaignWithAllDetails, setAddCampaignForm, setCampaignsIsLoading, setCronIdJob, setEditCampaignForm, setEditCampaignFormGroups, setLoadingCampaignDetails, setSelectedIdDetails, toggleCampaignDetails, toggleEditCampaignModal, toggleSchedulledCampaign, toogleAddCampaignModal } from '@/redux/features/campaignSlice'
import DetailsCampaign from '@/app/components/DetailsCampaign'

import eclair from '@/public/images/icons/eclair.png'
import croix from '@/public/images/icons/croix.png'
import poubelle from '@/public/images/icons/poubelle.png'
import edit from '@/public/images/icons/edit.png'
import EditCampaignModal from '@/app/components/EditCampaingModal'

export default function Campagnes() {

  const dispatch = useAppDispatch()

  const {openAddCampaignModal} = useAppSelector(state => state.campaign)
  const {openEditCampaignModal} = useAppSelector(state => state.campaign)
  const { loading } = useAppSelector(state => state.campaign)
  const { campaigns } = useAppSelector(state => state.campaign)
  const { selectedIdDetails } = useAppSelector(state => state.campaign)
  const { showCampaignDetails } = useAppSelector(state => state.campaign)
  const { loadingCampaignDetail } = useAppSelector(state => state.campaign)

  const handleClickAddCampaign = () => {
    dispatch(toogleAddCampaignModal(!openAddCampaignModal))
  }

  useEffect(() => {

    const fetchCampaigns = async () => {
        dispatch(setCampaignsIsLoading(true))
        await dispatch(getAllCampaigns())
        dispatch(setCampaignsIsLoading(false))
    }

    fetchCampaigns()

  }, [dispatch])

  const handleClickEnable = async ({campaignId, jobDate, index, schedulled, campaignName, cronId}: {campaignId: string, jobDate: string, index: number, schedulled: boolean, campaignName: string, cronId?: string}) => {

    const schedulledDateTimestamp = Date.parse(jobDate)

    const currentDate = new Date()
    const currentTimestamp = currentDate.getTime()
    
    if (currentTimestamp <  schedulledDateTimestamp) {
      
      if (!schedulled) {
        
        
        if(confirm(`Vous êtes sur le point d'activer la campagne << ${campaignName} >> à la date : ${formateDate(jobDate)}`)) {
  
          const result = await dispatch(enableJob({
            campaignId,
            jobDate
          }))
          if (result.payload.status === "error") {
            alert(result.payload.error.message)
          } else {
            setCronIdJob({campaignId, cronId: result.payload.cron_id})
            dispatch(toggleSchedulledCampaign(index))
          }
        }
      }
      if (schedulled) {
        if (cronId) {
          if (confirm(`Vous êtes sur le point de désactiver la campagne << ${campaignName} >> à la date : ${formateDate(jobDate)} . CRONID : ${cronId}`)) {
            const result = await dispatch(disableJob({
              campaignId,
              cronId
            }))
            if (result.payload.status = 'error') {
              alert(result.payload.error.message)
            } else {
              dispatch(toggleSchedulledCampaign(index))
            }
          } 
        } else {
          alert('Erreur lors de la désactivation (job id manquant)')
        }
      }
    } else {
      alert('La date programmée est déjà passée !')
    }

  }

  const handleClickCampaignDetails = async (campaignId: string) => {
    if (selectedIdDetails && selectedIdDetails === campaignId) {
      dispatch(toggleCampaignDetails())
    }

    if (selectedIdDetails === "" && !showCampaignDetails){
      dispatch(setSelectedIdDetails(campaignId))
      dispatch(toggleCampaignDetails())
      dispatch(setLoadingCampaignDetails(true))
      await dispatch(getOneCampaignWithAllDetails({campaignId}))
      dispatch(setLoadingCampaignDetails(false))
    }
    
    if (selectedIdDetails && !showCampaignDetails) {
      dispatch(toggleCampaignDetails())
      dispatch(setLoadingCampaignDetails(true))
      await dispatch(getOneCampaignWithAllDetails({campaignId}))
      dispatch(setLoadingCampaignDetails(false))
    }
    if (selectedIdDetails && selectedIdDetails !== campaignId && showCampaignDetails) {
      dispatch(setSelectedIdDetails(campaignId))
      dispatch(setLoadingCampaignDetails(true))
      await dispatch(getOneCampaignWithAllDetails({campaignId}))
      dispatch(setLoadingCampaignDetails(false))
    }
    
  }

  const handleClickEdit = (campagne: typeof campaigns[0]) => {
    if (campagne.finished) {
      alert('Vous ne pouvez plus modifier cette campagne car elle est terminée')
    } else {
      dispatch(setEditCampaignForm({name : 'nom', value: campagne.nom}))
      dispatch(setEditCampaignForm({name : 'id', value: campagne.id}))
      dispatch(setEditCampaignForm({name : 'description', value: campagne.description}))
      dispatch(setEditCampaignForm({name : 'date', value: campagne.date}))
      dispatch(setEditCampaignForm({name : 'emailTextHtml', value: campagne.emailText?.content!}))
      dispatch(setEditCampaignForm({name : 'emailTextDesign', value: campagne.emailText?.design!}))
      dispatch(setEditCampaignForm({name : 'emailTextId', value: campagne.emailTextId}))
      dispatch(setEditCampaignForm({name : 'emailObject', value: campagne.emailText?.nom!}))
      dispatch(setEditCampaignFormGroups(campagne.groups))
      dispatch(toggleEditCampaignModal(true))
    }
  }

  const formateDate = (dateString: string) => {

    if (dateString) {

      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
  
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    } else {
      return '--'
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
        <h2 className='text-2xl mb-4'>LES CAMPAGNES</h2>

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
                <button className='bg-green-300 p-2 hover:font-bold hover:border hover:border-white duration-200' onClick={handleClickAddCampaign}>
                  {openAddCampaignModal ? 'Fermer editeur' : 'Créer campagne'}
                </button>
            </div>
        </div>

        {
            openAddCampaignModal &&

            <AddCampaignModal/>

        }
        <div className="">
            <div className='grid grid-cols-6 border-b border-black mb-2' >
                <span>nom</span>
                <span>description</span>
                <span>date souhaité</span>
                <span>est programmé</span>
                <span>est terminé</span>
                <span>action</span>
            </div>

            { !loading &&
              campaigns.map((campaign, index) => (
                <div key={campaign.id} className='mb-2' >
                  
                  <div className={`grid grid-cols-6 ${selectedIdDetails === campaign.id ? 'bg-gray-100 border border-gray-300 p-2' : ''}`}>
                    <span
                      onClick={() => handleClickCampaignDetails(campaign.id)}
                      className=" hover:cursor-pointer"
                    >
                      {campaign.nom}
                    </span>
                    <span
                      onClick={() => handleClickCampaignDetails(campaign.id)}
                      className=" hover:cursor-pointer"
                    >
                      {campaign.description}
                    </span>
                    <span
                      onClick={() => handleClickCampaignDetails(campaign.id)}
                      className=" hover:cursor-pointer"
                    >
                      {formateDate(campaign.date)}
                    </span>
                    <span
                      className=""
                    >
                      {campaign.schedulled ? 'Oui' : 'Non'}
                    </span>
                    <span
                      className=""
                    >
                      {campaign.finished ? 'Oui' : 'Non'}
                    </span>
                    <div
                      className='flex gap-2'
                    >
                      <div
                        onClick={() => handleClickEnable({campaignId: campaign.id, jobDate: campaign.date, index, schedulled: campaign.schedulled, campaignName: campaign.nom, cronId: campaign.cronId})}
                        className=" hover:cursor-pointer flex justify-center"
                      >

                        {campaign.schedulled &&
                          <div className='relative'>
                            <Image
                              src={croix}
                              alt='icône croix'
                              height={25}
                              width={25}
                              className='hover:bg-orange-400 hover:py-1 duration-200'
                            />

                          </div>
                        }
                        {!campaign.schedulled &&
                          <div className='relative'>
                            <Image
                              src={eclair}
                              alt='icône éclair'
                              height={25}
                              width={16}
                              className='hover:bg-yellow-400 hover:py-1 duration-200'
                            />

                          </div>
                        }
                      </div>
                      <div
                        onClick={() => (console.log('yo'))}
                        className=" hover:cursor-pointer"
                      >

                        <div className='relative'>
                          <Image
                            src={poubelle}
                            alt='icône poubelle'
                            height={25}
                            width={25}
                            className='hover:bg-red-400 hover:py-1 duration-200'
                          />
                        </div>
                      </div>
                      <div
                        onClick={() => handleClickEdit(campaign)}
                        className=" hover:cursor-pointer"
                      >

                        <div className='relative'>
                          <Image
                            src={edit}
                            alt='icône edit'
                            height={25}
                            width={25}
                            className='hover:bg-green-400 hover:py-1 duration-200'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {showCampaignDetails && campaign.id === selectedIdDetails && loadingCampaignDetail &&
                    <div className='p-4 border border-gray-300 bg-white flex flex-col justify-center align-middle items-center'>

                      <CircleLoader color="#36d7b7" />
                      <p className='mt-5'>Récupération des détails de la campagne</p>
                    </div>
                  }

                  {showCampaignDetails && campaign.id === selectedIdDetails && !loadingCampaignDetail &&
                    <DetailsCampaign/>
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

        {/* {
            openAddCampaignModal &&

            <AddCampaignModal/>

        } */}

        {
            openEditCampaignModal &&

            <EditCampaignModal/>

        }
        
    </main>
  )
}
