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
        
        const { campaignId, cronId } = body

        if (campaignId && cronId) {
          
          const response = await fetch(`https://www.easycron.com/rest/delete?token=${process.env.NEXT_PUBLIC_EASYCRON_API_KEY}&id=${cronId}`)

          const result = await response.json()

          if (result.status === 'success') {
            await prisma.uPP_Campaign.update({
              where: {
                id: campaignId
              },
              data: {
                cronId: null,
                schedulled: false
              }
            })

          } else if (result.statut === 'error') {
            throw new Error('Impossible de supprimer la tâche')
          }
          return NextResponse.json(result)

        } else {
          return NextResponse.json({error: {message: 'Campaign ID or Cron ID missing'}, status: 'error'}, {status: 500, statusText: 'error'})
        }

      } else {
        throw new Error('User not signed in')
      }

    } catch (error) {
      return NextResponse.json(error)
    }

}