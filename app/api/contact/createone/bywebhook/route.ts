import { NextRequest, NextResponse } from 'next/server'

import prisma from "@/lib/prisma"

export const maxDuration = 60
export const revalidate = 0

interface Demande {
    content: string
    finition: string
    quantity: number
}

interface Data {
    nom: string
    prenom: string
    email: string
    telephone: string
    groups: {
        connect: {id: string}[]
    },
    demandes?: {
        createMany?: {
            data: Demande[]
        },
        create?: Demande
    }
}

export async function GET(req: NextRequest){

    try {

        const searchParams = req.nextUrl.searchParams
        const offre = searchParams.get('offre')
        const invitation = searchParams.get('invitation')
        const newsletter = searchParams.get('newsletter')
        const nom = searchParams.get('nom')
        const prenom = searchParams.get('prenom')
        const email = searchParams.get('email')
        const telephone = searchParams.get('telephone')
        const demande = searchParams.get('demande')

        if (email) {

            const foundContact = await prisma.uPP_Contact.findUnique({
                where: {
                    email: email
                },
                include: {
                    groups: true
                }
            })

            const data: Data= {
                nom: nom? nom : 'n/a',
                prenom: prenom? prenom : 'n/a',
                email: email? email : 'n/a',
                telephone: telephone? telephone : 'n/a',
                groups: {
                    connect: []
                },
            }

            if (demande) {

                const formatedDemande: Demande[] = []
                const arrayDemandes = demande.split(' ; ')

                arrayDemandes.forEach(arrayDemande => {
                    const splitedDemande = arrayDemande.split(' _ ')
                    formatedDemande.push({
                        quantity: Number(splitedDemande[0]),
                        content: splitedDemande[1],
                        finition: splitedDemande[2],
                    })
                })

                if (arrayDemandes.length === 1) {

                    data.demandes = {
                        create: formatedDemande[0]
                    }
                }

                if (arrayDemandes.length > 1) {

                    data.demandes = {
                        createMany: {data: formatedDemande }
                    }
                }

            }

            const newsletterObj = {id: 'clqxpytgl0004gwrmw1zx361m'}
            const offreObj = {id: 'clqxpytgm0005gwrm3a3c5lqc'}
            const invitationObj = {id: 'clqxpytgn0006gwrmk4glhhpz'}

            if (offre === "True" && invitation === "True" && newsletter === "True") {

                data.groups.connect = [newsletterObj, offreObj, invitationObj]

            } else if (offre === "True" && invitation === "True" && (!newsletter || newsletter === "False")) {

                data.groups.connect = [offreObj, invitationObj]                

            } else if (offre === "True" && (!invitation || invitation === "False") && newsletter === "True") {

                data.groups.connect = [newsletterObj, offreObj]

            } else if ((!offre || offre === "False") && invitation === "True" && newsletter === "True") {

                data.groups.connect = [newsletterObj, invitationObj]
    
            } else if (offre === "True" && (!invitation || invitation === "False") && (!newsletter || newsletter === "False")) {

                data.groups.connect = [offreObj]

            } else if ((!offre || offre === "False") && invitation === "True" && (!newsletter || newsletter === "False")) {

                data.groups.connect = [invitationObj]
    
            } else if ((!offre || offre === "False") && (!invitation || invitation === "False") && newsletter === "True") {

                data.groups.connect = [newsletterObj]

            }

            if (foundContact) {

                await prisma.uPP_Contact.update({

                    where: {
                        id: foundContact.id
                    },
                    data
                })

                return NextResponse.json({message: "User found, updated groups"})
                            
            } else {

                await prisma.uPP_Contact.create({
                    data
                })

                return NextResponse.json({message: "User created"})
            }
    
        } else {

            return NextResponse.json({error: "missing email"})

        }

    } catch (error) {

        return NextResponse.json(error)
        
    }

}