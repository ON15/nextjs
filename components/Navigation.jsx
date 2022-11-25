import Link from 'next/link'
// https://nextjs.org/docs/api-reference/next/link

export default function Navigation() {
    return (
        <nav className='site-navigation'>
            <Link href="/">Start</Link>
            <Link href="/news">News</Link>
            <Link href="/bilder">Bilder</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/standorte">Standorte</Link>
        </nav>
    )
}

