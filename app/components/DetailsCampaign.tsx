'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useEffect, useRef, useState } from 'react';

const DetailsCampaign = () => {
  
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [specialSent, setSpecialSent] = useState<number | null>(null)
  const [specialOpened, setSpecialOpened] = useState<number | null>(null)

  const { selectedCampaign } = useAppSelector(state => state.campaign)

  useEffect(() => {
    if (selectedCampaign?.emailText?.content) {

      const iframe = iframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc) {
  
          doc.open();
          doc.write(JSON.parse(selectedCampaign?.emailText?.content))
          doc.close();
        }
      }
    }
  }, [selectedCampaign]);


  useEffect(() => {
    if (selectedCampaign?.id === "clrqdg7c20002p2svaqhmdlej") {
      let countSent = 0
      let countOpened = 0
      selectedCampaign.events.forEach(event => {
        if (event.name === "envoyé") {
          countSent += event.eventContacts.length
        }
        if (event.name === "ouvert") {
          countOpened += event.eventContacts.length
        }
      })
      setSpecialSent(countSent)
      setSpecialOpened(countOpened)
    }
  }, [selectedCampaign])


  return (
    <div className='p-4 border border-gray-300 bg-white flex gap-2'>

      <div className='w-4/6'>

        <div>
          <h3 className=' inline-block text-lg mr-2'>Les évènements -</h3>

          <div className=' inline-flex font-light gap-2 text-gray-500'>
            <span>Sélectionnés : {selectedCampaign?.totalToSend}</span>
            <span> * </span>
            <span>Envoyés : {selectedCampaign?.numberSent}</span>
          </div>
        </div>

        <div className='p-2'>
        {
          selectedCampaign?.id === 'clrqdg7c20002p2svaqhmdlej' && specialSent && specialOpened &&
          <ul className='flex gap-2 small'>
            <li className='bg-blue-200 px-2 py-1 rounded text-xs'>envoyés : {specialSent} ({(specialSent * 100 / selectedCampaign?.totalToSend!).toFixed(2)}%)</li>
            <li className='bg-blue-200 px-2 py-1 rounded text-xs'>ouverts : {specialOpened} ({(specialOpened * 100 / selectedCampaign?.totalToSend!).toFixed(2)}%)</li>
          </ul>
        }

        {
          selectedCampaign?.id !== 'clrqdg7c20002p2svaqhmdlej' &&
          <ul className='flex flex-wrap gap-2 small'>
            
          {selectedCampaign?.events.map(event => (
            <li key={event.id} className='bg-blue-200 px-2 py-1 rounded text-xs'>{event.name} : {event.eventContacts.length} ({(event.eventContacts.length * 100 / selectedCampaign?.totalToSend!).toFixed(2)}%)</li>
          ))}
        </ul>
        }
        
         
        </div>
      </div>
      <div className=" w-2/6 h-[400px]">
        <iframe
          ref={iframeRef}
          className=" w-full h-full"
          title="Newsletter Preview"
        ></iframe>
      </div>


    </div>

  )
}

export default DetailsCampaign