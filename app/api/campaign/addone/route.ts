import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 60
export const revalidate = 0

export async function POST(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const body = await req.json()
            
            const { campaignName, campaignDate, emailTextId, campaignGroups, campaignDescription } = body

            if (campaignName && campaignDate && emailTextId && campaignGroups) {

                const campaign = await prisma.uPP_Campaign.create({
                    data: {
                        nom: campaignName,
                        date: campaignDate,
                        description: campaignDescription ? campaignDescription : '',
                        emailTextId: emailTextId,
                        groups: {
                            connect: campaignGroups
                        }
                    }
                })

                return NextResponse.json(campaign)

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