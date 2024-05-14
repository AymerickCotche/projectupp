import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 300
export const revalidate = 0

export async function PUT(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const searchParams = req.nextUrl.searchParams
            
            const emailtextId = searchParams.get('emailtextId')

            const body = await req.json()

            const { nom, content, design } = body

            let updateData: any = {}

            if (nom) updateData.nom = nom
            if (content) updateData.content = content
            if (design) updateData.design = design

            if (emailtextId) {

                const emailtext = await prisma.uPP_Emailtext.update({
                    where:{
                        id: emailtextId
                    },
                    data: {
                        nom,
                        content,
                        design
                    },
                })

                return NextResponse.json(emailtext)

            }  else {
                throw new Error('No emailtext id provided')
            }

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}