'use client'

import { setAddCampaignForm, setEditCampaignForm } from "@/redux/features/campaignSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import "flatpickr/dist/themes/material_green.css"
import { useState } from "react"

import Flatpickr from "react-flatpickr"

function PickDateAndTime() {

  const dispatch = useAppDispatch()

  const [theDate, setTheDate] = useState(new Date())

  const { date } = useAppSelector(state => state.campaign.editCampaignForm)

  return (
    <Flatpickr
      data-enable-time
      value={date ? date: new Date()}
      options={{
        time_24hr: true,
        dateFormat: 'd-M-Y | H:i'
      }}
      onChange={([date]) => {
        dispatch(setEditCampaignForm({name: 'date', value: date.toISOString()}))
      }}
    />
  )
}

export default PickDateAndTime