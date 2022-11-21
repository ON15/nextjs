/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/Layout'
import Image from 'next/image'
import hongKong from '@/img/hong-kong.jpg';

export default function bilder() {
    return (
        <Layout title="Bilder">
            <Image
                alt="Hong Kong"
                src={hongKong}
                sizes="(max-width: 52rem) 90vw, 48rem"
            />


            <img src="https://images.unsplash.com/photo-1668910283626-f79cca6429c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="logo" className='logo' width="320" height="100" />
            <img src="/img/logo.jpg" alt="Bildbeschreibung" className='logo' width="320" height="100" />

            {/* Bild optimal laden für jede Pixeldichte mit srcSet */}
            <img src="/img/logo@1x.jpg"
                srcSet='/img/logo@1x.jpg 1x, /img/logo@2x.jpg 2x'
                alt="logo"
                className='logo'
                width="320" height="100"
                loading='lazy' />

            {/* Bildgröße passend auf Seitenverhältnis laden */}
            <img src="https://picsum.photos/id/1011/900/450"
                // srcSet='https://picsum.photos/id/1011/450/225 450w, https://picsum.photos/id/1011/900/450 900w'
                srcSet="https://picsum.photos/id/1011/450/225 450w, https://picsum.photos/id/1011/900/450 900w, https://picsum.photos/id/1011/1350/675 1350w, https://picsum.photos/id/1011/1800/900 1800w"
                sizes="(max-width: 50rem) 90vw, 48rem"
                alt="Frau im Kanu"
                className='image'
                width="2" height="1"
                loading='lazy'
            />

            <picture>
                <source type="image/avif" srcSet="/img/herbst.avif" />
                <source type="image/webp" srcSet="/img/herbst.webp" />
                <img
                    className="image"
                    src="/img/header-image-landscape@1000.jpg"
                    srcSet="/img/header-image-landscape@1000.jpg 1000w,/img/header-image-landscape@1500.jpg 1500w,/img/header-image-landscape@2000.jpg 2000w"
                    sizes="(max-width: 52rem) 90vw, 50rem"
                    loading="lazy"
                    alt="Mann mit Kind am Strand"
                />
            </picture>
            <p>Text</p>
        </Layout>
    )
}

