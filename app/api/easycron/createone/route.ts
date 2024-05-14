import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 300
export const revalidate = 0

export async function POST(req: NextRequest){

    try {
        
      const session = await getServerSession(authOptions)

      if (session) {

        const body = await req.json()
        
        const { campaignId, jobDate } = body

        if (campaignId && jobDate) {
            
          const date = new Date(jobDate)
          
          const minutes = date.getUTCMinutes()
          const hours = date.getUTCHours() + 4
          const dayOfMonth = date.getUTCDate()
          const month = date.getUTCMonth() + 1 // Les mois en JavaScript commencent à 0
          const year = date.getFullYear() // Les mois en JavaScript commencent à 0
          const dayOfWeek = "*"; // Jour de la semaine non spécifique
          
          const cron = `0,${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek} ${year}`;
          
          const response = await fetch(`https://www.easycron.com/rest/add?token=${process.env.NEXT_PUBLIC_EASYCRON_API_KEY}&cron_expression=${cron}&url=https://upp-two.vercel.app/api/sendemailsendgrid?campaignId=${campaignId}`)

          const result = await response.json()

          if (result.status === 'success') {
            await prisma.uPP_Campaign.update({
              where: {
                id: campaignId
              },
              data: {
                cronId: result.cron_job_id,
                schedulled: true
              }
            })
          } else if (result.statut === 'error') {
            throw new Error('Impossible de créer la tâche')
          }
          
          return NextResponse.json(result)

        } else {
          throw new Error('Datas are missing')
        }

      } else {
        throw new Error('User not signed in')
      }

    } catch (error) {
      return NextResponse.json(error)
    }

}