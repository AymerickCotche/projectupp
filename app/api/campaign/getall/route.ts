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

            const campaigns = await prisma.uPP_Campaign.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    groups: true,
                    emailText: true
                }
            })

            return NextResponse.json(campaigns)

        } else {
            return NextResponse.json("User not signed in",{status: 403, statusText: "error"})
        }

    } catch (error) {
        return NextResponse.json(error, {status: 500, statusText: "error"})
    }

}