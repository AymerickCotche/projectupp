import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

interface Group {
    id: string
    nom: string
    createdAt: string
    updatedAt: string
  }

export const maxDuration = 300
export const revalidate = 0

export async function POST(req: NextRequest){

    try {

        const body = await req.json()

        const { nom, prenom, email, telephone } = body

        if (email) {

            const foundContact = await prisma.uPP_Contact.findUnique({
                where: {
                    email: email
                },
                include: {
                    groups: true
                }
            })

            if (foundContact) {
                if (foundContact.groups.find(group => group.id === 'clqxpytgn0006gwrmk4glhhpz')) {
                    return NextResponse.json({message: "User already registered and in VP group"})
                } else {
                    const contact = await prisma.uPP_Contact.update({

                        where: {
                            id: foundContact.id
                        },

                        data: {
                            groups: {
                                connect: {
                                    id: 'clqxpytgn0006gwrmk4glhhpz'
                                }
                            }
                        }
                    })
                    return NextResponse.json({message: "User already registered. Add in VP group done"})
                }
                            
            } else {
                const contact = await prisma.uPP_Contact.create({
                    data: {
                        nom: nom? nom : 'n/a',
                        prenom: prenom? prenom : 'n/a',
                        email: email? email : 'n/a',
                        telephone: telephone? telephone : 'n/a',
                        groups: {
                            connect: {id: 'clqxpytgn0006gwrmk4glhhpz'}
                        }
                    }
                })    
                return NextResponse.json(contact)
            }
    
    
        } else {
            return NextResponse.json({error: "missing email"})
        }

    } catch (error) {
        return NextResponse.json(error)
    }

}