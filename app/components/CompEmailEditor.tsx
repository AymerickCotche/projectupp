'use client'

import { setAddCampaignForm } from '@/redux/features/campaignSlice'
import { useAppDispatch } from '@/redux/hooks'
import React, {  useRef } from 'react'
import EmailEditor,  { EditorRef, EmailEditorProps } from 'react-email-editor'

interface MyProps {
  design?: string
}

const CompEmailEditor = ({design}: MyProps) => {

  const dispatch = useAppDispatch()

  const emailEditorRef = useRef<EditorRef>(null)

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    
    unlayer.loadDesign(design ? JSON.parse(JSON.parse(design)) : {"counters":{"u_column":1,"u_row":1,"u_content_html":1},"body":{"id":"bACu8ZtdLM","rows":[{"id":"TxzVwD8IxU","cells":[1],"columns":[{"id":"AfDk6pZLg3","contents":[{"id":"auYPUEKRdF","type":"html","values":{"html":"<div style=\"text-align:center\"><a href=\"https://upp-two.vercel.app/users/manage-preferences?contactId=XX-CONTACTTOREPLACE--XX\" style=\"text-decoration:none;color:gray;font-size:10px;\"><span>mettre à jour vos préférences</span></a></div>","hideDesktop":false,"displayCondition":null,"containerPadding":"10px","anchor":"","_meta":{"htmlID":"u_content_html_1","htmlClassNames":"u_content_html"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true}}],"values":{"backgroundColor":"","padding":"0px","border":{},"borderRadius":"0px","_meta":{"htmlID":"u_column_1","htmlClassNames":"u_column"}}}],"values":{"displayCondition":null,"columns":false,"backgroundColor":"","columnsBackgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":"no-repeat","size":"custom","position":"center","customPosition":["50%","50%"]},"padding":"0px","anchor":"","hideDesktop":false,"_meta":{"htmlID":"u_row_1","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true}}],"headers":[],"footers":[],"values":{"popupPosition":"center","popupWidth":"600px","popupHeight":"auto","borderRadius":"10px","contentAlign":"center","contentVerticalAlign":"center","contentWidth":"500px","fontFamily":{"label":"Arial","value":"arial,helvetica,sans-serif"},"textColor":"#000000","popupBackgroundColor":"#FFFFFF","popupBackgroundImage":{"url":"","fullWidth":true,"repeat":"no-repeat","size":"cover","position":"center"},"popupOverlay_backgroundColor":"rgba(0, 0, 0, 0.1)","popupCloseButton_position":"top-right","popupCloseButton_backgroundColor":"#DDDDDD","popupCloseButton_iconColor":"#000000","popupCloseButton_borderRadius":"0px","popupCloseButton_margin":"0px","popupCloseButton_action":{"name":"close_popup","attrs":{"onClick":"document.querySelector('.u-popup-container').style.display = 'none';"}},"backgroundColor":"#e7e7e7","preheaderText":"","linkStyle":{"body":true,"linkColor":"#0000ee","linkHoverColor":"#0000ee","linkUnderline":true,"linkHoverUnderline":true},"backgroundImage":{"url":"","fullWidth":true,"repeat":"no-repeat","size":"custom","position":"center"},"_meta":{"htmlID":"u_body","htmlClassNames":"u_body"}}},"schemaVersion":16})
    unlayer?.addEventListener('design:updated', function(updates: any) {
      // Design is updated by the user
      
      unlayer.exportHtml(function(data) {
        const json = data.design // design json
        const html = data.html // design html
        
        dispatch(setAddCampaignForm({
          name: 'emailTextHtml',
          value: JSON.stringify(html)
        }))
        dispatch(setAddCampaignForm({
          name: 'emailTextDesign',
          value: JSON.stringify(json)
        }))
    
      }, {
        minify: true
      })
    })
  }

  return (
    <div>
      <EmailEditor ref={emailEditorRef} onReady={onReady} />
    </div>

  )
}

export default CompEmailEditor