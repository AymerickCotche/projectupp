import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className='flex justify-between border-b border-black mb-4 items-center p-2 bg-g'>
        <div>
            <h1>UPP</h1>
        </div>

        <nav>
            <ul className='flex gap-4'>
                <li className='hover:font-semibold hover:cursor-pointer'>
                    <Link
                        href='/'
                    >
                        Accueil
                    </Link>
                </li>
                <li className='hover:font-semibold hover:cursor-pointer'>
                    <Link
                        href='/contacts'
                    >
                        Contact
                    </Link>
                </li>
                <li className='hover:font-semibold hover:cursor-pointer'>
                    <Link
                        href='/groupes'
                    >
                        Groupe
                    </Link>
                </li>
                <li className='hover:font-semibold hover:cursor-pointer'>
                    <Link
                        href='/campagnes'
                    >
                        Campagne
                    </Link>
                </li>
            </ul>
        </nav>

        <div className=''>
            <span>user</span>
        </div>
    </header>
  )
}

export default Header