import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const maxDuration = 60
export const revalidate = 0

export async function GET(){

    try {
        
        const session = await getServerSession(authOptions)

        if (session) {

            const emailtexts = await prisma.uPP_Emailtext.findMany()

            return NextResponse.json(emailtexts)

        } else {
            throw new Error('User not signed in')
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}