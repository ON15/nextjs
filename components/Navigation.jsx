import Link from 'next/link'
import React from 'react'

export default function Navigation() {
    return (
        <nav className='site-navigation'>
            <Link href="/">Start</Link>
            <Link href="/news">News</Link>
            <Link href="/bilder">Bilder</Link>
        </nav>
    )
}

