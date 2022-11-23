import Layout from '@/components/Layout';
import Image from 'next/image';

const apiPath = 'https://react.webworker.berlin/wp-json/wp/v2/';

/* Wenn man einen dynamischen Pfad hat, muss man Next mitteilen,
welche Pfade das System statisch generieren soll, hier also
eine Liste der vorhanden Blog-Slugs übergeben.
https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
*/
export async function getStaticPaths() {
    let paths = [];

    try {
        const response = await fetch(`${apiPath}posts`);
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Pfade');
        }
        const posts = await response.json();
        /* 
          Der Schlüsselname "params" ist vorgegeben. Der Schlüsselname
          "slug" entspricht dem Platzhalter [slug] im Dateinamen von [slug].jsx
          Die Einträge im paths-Array werden an getStaticProps übergeben,
          so dass für jeden Eintrag eine Seite generiert werden kann.
          https://nextjs.org/docs/api-reference/data-fetching/get-static-paths
        */
        paths = posts.map(({ slug }) => ({ params: { slug } }));
    } catch (error) {
        console.log(error);
    }
    return { paths, fallback: false };
}


export async function getStaticProps({ params }) {
    /* 
    Hier wieder in Try-Catch Daten holen, und zwar die Daten zu einem Blogbeitrag
    mit Hilfe des Slugs, welcher in params.slug steckt.
    Der URL-Parameter lautet ?slug=slug
    Achtung: Es kommt trotzdem ein Array zurück, allerding einer mit nur einem Eintrag.
    */
    let post = {};
    try {
        const response = await fetch(`${apiPath}posts?slug=${params.slug}`);
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Post');
        }
        post = await response.json();
    } catch (error) {
        console.log(error);
    }
    /* 
    1. Prüft, ob featured_media in post vorhanden ist.
    2. Wenn ja, ruft mit der ID getTitleImage auf und speichert die Antwort unter post.titleImage
    */
    if (post[0].featured_media) {
        post[0].titleImage = await getTitleImage(post[0].featured_media)
    }
    return {
        props: {
            post: post[0]
        },
        revalidate: 3600, // Einmal pro Stunde aktualisieren
    }
}

export default function BlogPost({ post }) {
    console.log({ post })
    return (
        <Layout title={post.title.rendered}>
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            {/* {post.content.rendered} */}
            {/* 
            1. Prüfen, ob ein Bild vorhanden ist.
            2. Wenn ja, Bilddaten nutzen, um ein Image-Element (Next Image-Komponente) darzustellen.
            */}
            {
                post.titleImage && <Image
                    alt={post.titleImage.alt}
                    src={post.titleImage.src}
                    sizes="(max-width: 52rem) 90vw, 48rem"
                    width={post.titleImage.width}
                    height={post.titleImage.height}
                />
            }
        </Layout>
    );
}

// get image data
async function getTitleImage(imageId) {
    console.log("imageId:", imageId)
    let image = {};
    try {
        const response = await fetch(`${apiPath}media/${imageId}`);
        console.log({ response })
        if (!response.ok) {
            throw new Error('Fehler beim Laden des Bildes');
        }
        image = await response.json();
    } catch (error) {
        console.log(error);
        return null;
    }

    /* 
    1. Holt mit Hilfe der ID die Daten für das entsprechende Bild.
    2. Gebt ein Objekt zurück, welches nur ausgesuchte Daten enthält:
    */
    return {
        src: image.source_url,
        width: image.media_details.width,
        height: image.media_details.height,
        alt: image.alt_text
    }
}
