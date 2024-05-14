'use client'

import { getAllEmailTexts, setSelectedEmailText } from "@/redux/features/emailTextSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect } from "react"

const SelectEmailDesign = () => {

  const dispatch = useAppDispatch()

  const { emailTexts } = useAppSelector(state => state.emailText)

  useEffect(() => {
    const fetchEmailTexts = async() => {
      await dispatch(getAllEmailTexts())
    }

    fetchEmailTexts()
  }, [dispatch])

  const handleEmailtextChange = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log(e.currentTarget.value);
    dispatch(setSelectedEmailText(emailTexts.find(emailText => emailText.id === e.currentTarget.value)))
  }

  return (
    <div>
      <label htmlFor="designSelect">Choisir un ancien design:</label>

      <select name="designSelect" id="designSelect" onChange={handleEmailtextChange}>
        <option value="">--Sélectionner un design existant--</option>
        {emailTexts.map(emailText => (
          <option key={emailText.id} value={emailText.id}>{emailText.nom}</option>
        ))}
      </select>
    </div>
    

  )
}

export default SelectEmailDesign