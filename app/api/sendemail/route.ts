import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import * as cheerio from 'cheerio'

import prisma from "@/lib/prisma"

export const maxDuration = 60
export const revalidate = 0

export async function GET(req: NextRequest){

  try {

    const searchParams = req.nextUrl.searchParams
    const campaignId = searchParams.get('campaignId')

    if (campaignId) {

      const campaign = await prisma.uPP_Campaign.findUnique({
        where: {
          id: campaignId,
        },
        include: {
          groups: {
            include: {
              contacts: true
            }
          },
          emailText: true
        }
      })

      if (campaign) {

        const transporter = nodemailer.createTransport({
          host: process.env.HOST_EMAIL_ADDR,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PWD,
          },
          requireTLS: true
        })
        
        let uniqueObjectsMap = new Map();

        for (const groupName in campaign.groups) {
          for (const contactObj of campaign.groups[groupName].contacts) {

            let key = `${contactObj.id}-${contactObj.email}`

            if (!uniqueObjectsMap.has(key)) {
              uniqueObjectsMap.set(key, contactObj)
            }

          }
        }

        const uniqueContactArray = Array.from(uniqueObjectsMap.values())

        const $ = cheerio.load(JSON.parse(campaign.emailText.content))
      
        type objLink = {
          countlink: number
          spanText: string
        }
        const linkDatas: objLink[] = []

        let countlink = 0


        $('a').each(function() {
          countlink++
          const href = $(this).attr('href')
          const spanText = $(this).find('span').text()

          $(this).attr('href', `https://projectupp.vercel.app/api/sendemail/updateopenedemail?openedEventId=XX-EVENTIDTOREPLACE--XX${countlink}&contactId=XX-CONTACTTOREPLACE--XX&redirect=${href}`).html()
  
          linkDatas.push({
            countlink,
            spanText : spanText.length > 0 ? spanText : 'img : ' + href
          })
      })

      const preUpdatedHtmlString = $.html()

      let updatedHtmlString = preUpdatedHtmlString

      linkDatas.forEach( async (linkdata, index) => {

        const linkEvent = await prisma.uPP_Event.create({
          data: {
            campaignId,
            name: linkdata.spanText,
          }
        })

        updatedHtmlString = updatedHtmlString.replace(`XX-EVENTIDTOREPLACE--XX${index + 1}`, `${linkEvent.id}`)
      })

      const batchSize = 100

      await prisma.uPP_Campaign.update({
        where: {
          id: campaignId
        },
        data: {
          batchToDo: uniqueContactArray.length / batchSize,
          numberSent: 0,
          batchDone: 0
        }
      })

      const openedEvent = await prisma.uPP_Event.create({
        data: {
          campaignId,
          name: 'ouvert',
        }
      })

      const openedEventId = openedEvent.id

      const sentEvent = await prisma.uPP_Event.create({
        data: {
          campaignId,
          name: 'envoyé',
        }
      })

      const sentEventId = sentEvent.id

      for (let i = 0; i < uniqueContactArray.length; i += batchSize) {
        const batch = uniqueContactArray.slice(i, i + batchSize);
        
        await prisma.uPP_Campaign.update({
          where: {
            id: campaignId
          },
          data: {
            totalToSend: uniqueContactArray.length,
          }
        })
    
        const emailPromises = batch.map(async (email) => {

          const imgTag = `<img src="https://projectupp.vercel.app/api/sendemail/updateopenedemail?openedEventId=${openedEventId}&contactId=${email.id}" alt="icon" style="display:none;">`

          const bodyStartIndex = updatedHtmlString.indexOf('<body')

          
          const bodyEndIndex = updatedHtmlString.indexOf('>', bodyStartIndex) + 2
          
          const emailHtml = updatedHtmlString.slice(0, bodyEndIndex) + imgTag + updatedHtmlString.slice(bodyEndIndex)

          const finalEmailString = emailHtml.replace(new RegExp('XX-CONTACTTOREPLACE--XX', 'g'), email.id)

          return transporter.sendMail({
            from: `${process.env.SENDER_FROM} <${process.env.SENDER_EMAIL}>`,
            to: email.email,
            subject: `${campaign.emailText.nom}`,
            html: finalEmailString,
          })
        })
    
        try {

          await Promise.all(emailPromises)

          await prisma.uPP_Campaign.update({
            where: {
              id: campaignId
            },
            data: {
              numberSent: {
                increment: batch.length
              },
              batchDone: {
                increment: 1
              }
            }
          })

          batch.forEach(async (email) => {
            const foundEvent = await prisma.uPP_ContactEvents.findUnique({
              where: {
                contactId_eventId: {
                  eventId: sentEventId,
                  contactId: email.id as string
                }
              }

            })

            if (foundEvent) {

              await prisma.uPP_ContactEvents.update({
                where: {
                  contactId_eventId: {
                    eventId: sentEventId,
                    contactId: email.id as string
                  }
                },
                data: {
                  counter: {
                    increment: 1
                  }
                }

              })
            } else {

              await prisma.uPP_ContactEvents.create({
                data: {
                  eventId: sentEventId,
                  contactId: email.id as string,
                  counter: 1
                },

              })
            }
          })

          await prisma.uPP_Campaign.update({
            where: {
              id: campaignId
            },
            data: {
              finished: true
            }
          })

        } catch (error) {
          console.error(`Error in sending batch ${i / 100 + 1}`, error);
        }
      }
        
      return NextResponse.json(campaign)
        
      } else {
        throw new Error("Campaign not found")
      }

    } else {
      throw new Error("No campaign Id provided")
    }   

  } catch (error) {
    return NextResponse.json(error)
  }

}