'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'

const DetailsContact = () => {

  const dispatch = useAppDispatch()

  const { selectedContact } = useAppSelector(state => state.contact)

  const campaignsWithGroupInfo = selectedContact?.groups?.flatMap((group) =>
    group.campaigns!.map((campaign) =>({
      campaignInfo: campaign,
      groupInfo: group,
    }))
  )

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

  return (
    <div className='p-4 border border-gray-300 bg-white '>


      <div className='flex gap-2 p-2'>

        <div className='p-2 flex-1 border border-gray-400'>

          <h3 className='mb-2 text-lg font-semibold'>Les campagnes</h3>

          <ul>
            {campaignsWithGroupInfo?.map(campaign => (
              <div key={campaign.campaignInfo.id}>

                <li key={campaign.campaignInfo.id}>{campaign.campaignInfo.nom} - {campaign.groupInfo.nom}</li>

                <ul className='p-2'>
                  {campaign.campaignInfo.events.map(event => {
                    if (event.eventContacts[0]) {
                      return (
                        <li key={event.id}>{event.name} : {event.eventContacts[0] ? event.eventContacts[0].counter : '0'} fois</li>
                      )
                    }
                    })}
                </ul>
              </div>
            ))}
          </ul>
        </div>

        <div className='p-2 flex-1 border border-gray-400'>
          <h3 className='mb-2 text-lg font-semibold'>Les demandes - devis</h3>
          <ul className='p-2'>
            {selectedContact?.demandes &&
              selectedContact?.demandes.map(demande => (
                <li key={demande.id}>
                  {formateDate(demande.createdAt)} : {demande.quantity} {demande.content} {demande.finition}
                </li>
              ))
            }
          </ul>
        </div>
      </div>

    </div>

  )
}

export default DetailsContact