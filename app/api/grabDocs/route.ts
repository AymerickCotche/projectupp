import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { Prisma } from "@prisma/client"

import fs from "fs"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import sellsy from '@/lib/sellsy'

export const maxDuration = 300
export const revalidate = 0

type ContactWithCampaigns = Prisma.UPP_ContactGetPayload<{
  include: {
    groups: {
      include : {
        campaigns:true
      }
    },
    demandes: true
  }
}>

interface Doc {
  id: string
  isDeposit: string
  ownerFullName: string
  ident: string
  thirdname: string
  thirdid: string
  contactName: string
  displayedDate: string
  totalAmount: string
  thirdemail: string
  thirdtel: string
  thirdmobile: string
  doctypeid: string
  step: string
  formatted_dueAmount: string
  step_label: string
  formatted_totalAmount: string
  formatted_totalAmountTaxesFree: string
  formatted_created: string
  formatted_displayedDate: string
  campaigns: string
  demandes: ContactWithCampaigns['demandes']
  invoiceDateTimeStamp: number
  foundBcdi: string
  bcdiDate?: string
  bcdiDateTimestamp?: number
  fromBcdi: boolean
  bcdiName: string
  docName: string
}

interface FormattedDoc {
  docId: string
  docName: string
  document?: string
  email?: string
  date: Date
  montant: string
  status?: string
  campaigns?: string
  bcdiDate?: Date
  demandes?: ContactWithCampaigns['demandes']
  foundBcdi?: string
  bcdiName?: string
  contactId: string
  fromBcdi: boolean
}

interface TreeDoc {
  id: string
  doctype: string
  html: string
  level: number
  json_parents: string
  left: number
  top: number
}


async function fetchContacts(){
  const contacts = await prisma.uPP_Contact.findMany({
    include: {
        groups: {
          include: {
            campaigns: true
          }
        },
        demandes: true
    }
  })

  return contacts
}

async function fetchSellsyInvoices(){

    const actualDate = Date.now() / 1000

    const dateMinusTwoDays = actualDate - (86400 * 2)
    const datePlusOneDay = actualDate + 86400

    // const params = {
    //   doctype: "invoice",
    //   pagination: {
    //     nbperpage: 5000,
    //     pagenum: 1
    //   },
    //   search: {
    //     periodecreationDate_start: 1546300800 + (31535999 * 1),
    //     periodecreationDate_end: 1577836799 + (31535999 * 5),
    //   }
    // }
 
    const params = {
      doctype: "invoice",
      pagination: {
        nbperpage: 5000,
        pagenum: 1
      },
      search: {
        periodecreationDate_start: dateMinusTwoDays,
        periodecreationDate_end: datePlusOneDay,
      }
    }
  
    const data = await sellsy.api({
      method: "Document.getList",
      params: params,
      
    })
  
    const { response, error, status} = data
  
    const { infos, result } = response
      
    const arrayResults: Doc[] = Object.values(result)

    const withoutDepositResults = arrayResults.filter(invoice => invoice.isDeposit === 'N' && (invoice.step !== 'cancelled' && invoice.step !== 'draft'))

    return withoutDepositResults
  
}

const fetchTreeDoc = async (id: string) => {
  const params = {
    doctype: "invoice",
    docid: id
  }

  const result = await sellsy.api({
    method: "Document.getTree",
    params: params,
    
  })

  const { response, error, status } = result

  if (status === 'success') {
    const data: TreeDoc[] = Object.values(response)

    const foundOrders: TreeDoc[] = data.filter((doc) => doc.doctype === 'order')

    return foundOrders.map(order => order.id)
  }

}

const fetchOneDoc = async (id: string) => {
  const params = {
    doctype: "order",
    docid: id
  }

  const result = await sellsy.api({
    method: "Document.getOne",
    params: params,
    
  })

  const { response, error, status } = result

  if (status === "success") {
    return response
  } 
}

const saveInvoicedocContact = async (invoices: FormattedDoc[]) => {

  try {

    await prisma.uPP_ContactFacture.createMany({
      data: invoices,
      skipDuplicates: true,
    })
    
  } catch (error) {
    console.log(error);
  }

}

export async function GET(){

  try {

    const contacts = await fetchContacts()

    const allInvoices = await fetchSellsyInvoices()

    const allContactsDocs: FormattedDoc[] = []

    let concernedInvoicescount = 0

    let invoicecount = 0

    for (const invoice of allInvoices) {
      invoicecount++

      invoice.campaigns = ""

      console.log('----- ' + invoicecount + ' / ' + allInvoices.length + ' ------');

      const foundContact = contacts.find(contact => contact.email === invoice.thirdemail)

      if (foundContact) {

        concernedInvoicescount++

        const invoiceDateString = invoice.displayedDate + "T00:00:00.000Z"

        const invoiceDateDate = new Date(invoiceDateString)
        const invoiceDateTimeStamp = invoiceDateDate.getTime()

        const treeDocsIds = await fetchTreeDoc(invoice.id)

        if (treeDocsIds && treeDocsIds.length > 0) {

          for (const treeDocsId of treeDocsIds) {

            const order = await fetchOneDoc(treeDocsId)

            if (order) {

              const orderDateString = order.displayedDate_unformatted + "T00:00:00.000Z"
              const orderDateDate = new Date(orderDateString)
              const orderDateTimeStamp = orderDateDate.getTime()

              invoice.invoiceDateTimeStamp = invoiceDateTimeStamp
              invoice.foundBcdi = order.ident + ' : ' + order.displayedDate
              invoice.bcdiDate = order.displayedDate
              invoice.bcdiDateTimestamp = orderDateTimeStamp
              invoice.fromBcdi = true
              invoice.bcdiName = order.ident

              for (const group of foundContact.groups) {
                for (const campaign of group.campaigns) {
                  const campaignDateString = campaign.date
                  const campaignDate = new Date(campaignDateString)
                  const campaignDateTimestamp = campaignDate.getTime()
      
                  const interval = campaignDateTimestamp <= orderDateTimeStamp && campaignDateTimestamp >= orderDateTimeStamp - (7*24*3600 * 1000)

                  if (interval) {

                    invoice.campaigns = invoice.campaigns + " -" + campaign.nom
                    
                  }
                }
              }
            } 
          }

        } else {

          invoice.invoiceDateTimeStamp = invoiceDateTimeStamp

          invoice.bcdiDate = ''
          invoice.fromBcdi = false

          for (const group of foundContact.groups) {

            for (const campaign of group.campaigns) {

              const campaignDateString = campaign.date
              const campaignDate = new Date(campaignDateString)
              const campaignDateTimestamp = campaignDate.getTime()
  
              const interval = campaignDateTimestamp <= invoiceDateTimeStamp && campaignDateTimestamp >= invoiceDateTimeStamp - (7*24*3600 * 1000)

              if (interval) {

                invoice.campaigns = invoice.campaigns + " -" + campaign.nom

              }
            }
          }
        }

        const formattedInvoice = {
          docId: invoice.id,
          contactId: foundContact.id,
          date: new Date(invoice.invoiceDateTimeStamp),
          montant: invoice.formatted_totalAmountTaxesFree,
          campagnes: invoice.campaigns ? invoice.campaigns : undefined,
          bcdiDate: invoice.bcdiDateTimestamp ? new Date(invoice.bcdiDateTimestamp) : undefined,
          fromBcdi: invoice.fromBcdi,
          docName: invoice.ident,
          bcdiName: invoice.bcdiName
        }

        allContactsDocs.push(formattedInvoice)
      }        

    }

    console.log('total : ' + allInvoices.length);

    console.log('venant de contacts présents dans upp : ' + concernedInvoicescount);
    console.log('dans le array des foundcontact dans upp : ' + allContactsDocs.length);

    await saveInvoicedocContact(allContactsDocs)

    return NextResponse.json('done')

  } catch (error) {
    return NextResponse.json(error)
  }

}