'use client'

import { useEffect } from "react"

export default function Page() {

  useEffect(() => {
    const test = async () => {
      const data = await fetch('/api/grabDocs/')
    }

    test()
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      <h2>yo</h2>

    </main>
  )
}
 