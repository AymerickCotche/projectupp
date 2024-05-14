import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import sellsy from '@/lib/sellsy'

export const maxDuration = 60
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
  campaigns: string[]
  demandes: ContactWithCampaigns['demandes']
  invoiceDateTimeStamp: number
}

interface FormattedDoc {
  id: string
  document: string
  clientName: string
  email: string
  date: string
  montant: string
  status: string
  campaigns: string[]
  invoiceDateTimeStamp: number
  demandes: ContactWithCampaigns['demandes']
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

async function fetchContactsDocs(page: number){
  const docs = await prisma.uPP_ContactFacture.findMany({
    orderBy: {
      date: 'desc'
    },
    take: 20,
    skip: (page - 1) * 20,
    include: {
        contact: {
          include: {
            demandes: true
          }
        }
    }
  })

  return docs
}


export async function GET(req: NextRequest){

  try {
      
    const session = await getServerSession(authOptions)

    if (session && session.user.id) {

      const searchParams = req.nextUrl.searchParams
      const pageNumber = searchParams.get('pagenumber')

      if (Number(pageNumber) > 0) {

        const allContactsDocs = await fetchContactsDocs(Number(pageNumber))
  
        return NextResponse.json(allContactsDocs)

      } else {
        return NextResponse.json('not a correct page number')
      }


    } else {
      throw new Error('User not signed in')
    }

  } catch (error) {
    return NextResponse.json(error)
  }

}