import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 60
export const revalidate = 0

export async function DELETE(req: NextRequest){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const searchParams = req.nextUrl.searchParams
            const emailtextId = searchParams.get('emailtextId')

            if (emailtextId) {

                const emailtext = await prisma.uPP_Emailtext.delete({
                    where: {
                        id: emailtextId
                    }
                })

                return NextResponse.json(emailtext)

            } else {
                throw new Error('No emailtext id provided')
            }

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}