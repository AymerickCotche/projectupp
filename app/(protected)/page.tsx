import dynamic from 'next/dynamic'
import ContactsDocs from '../components/ContactsDocs'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col">
      <ContactsDocs/>

    </main>
  )
}
 