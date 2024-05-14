import { NextResponse } from 'next/server'

import prisma from "@/lib/prisma"

export const maxDuration = 60
export const revalidate = 0

export async function GET(){

    try {

        const groups = await prisma.uPP_Grouplist.findMany({
            include: {
                _count: {
                    select: {
                        contacts: true
                    }
                }
            }
        })

        return NextResponse.json(groups)

    } catch (error) {
        return NextResponse.json(error)
    }

}