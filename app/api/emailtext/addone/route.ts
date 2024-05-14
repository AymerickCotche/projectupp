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

            const { emailTextName, emailTextContent, emailTextDesign } = body

            if (emailTextName && emailTextContent && emailTextDesign) {


                const emailText = await prisma.uPP_Emailtext.create({
                    data: {
                        nom: emailTextName,
                        content: emailTextContent,
                        design: JSON.stringify(emailTextDesign)
                    }
                })

                return NextResponse.json(emailText)

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