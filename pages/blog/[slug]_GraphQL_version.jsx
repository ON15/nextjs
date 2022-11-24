import Layout from '@/components/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';

const apiPath = 'https://react.webworker.berlin/wp-json/wp/v2/';
const graphQlPath = 'https://react.webworker.berlin/graphql';

/* Wenn man einen dynamischen Pfad hat, muss man Next mitteilen,
welche Pfade das System statisch generieren soll, hier also
eine Liste der vorhanden Blog-Slugs übergeben.
https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
*/
export async function getStaticPaths() {
    let paths = [];

    const query = `{
        posts {
            nodes {
            slug
            }
        }
        }`;

    try {
        const response = await fetch(`${graphQlPath}?query=${query}`);

        if (!response.ok) {
            throw new Error('Fehler beim Laden der Pfade');
        }

        const jsonData = await response.json();

        post = jsonData.data.posts.nodes;
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
    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
    /*
    Hier wieder in Try-Catch Daten holen, und zwar die Daten zu einem Blogbeitrag
    mit Hilfe des Slugs, welcher in params.slug steckt.
    Der URL-Parameter lautet ?slug=slug
    Achtung: Es kommt trotzdem ein Array zurück, allerding einer mit nur einem Eintrag.
    */
    let post = {};

    const query = `{
        post(id: "${params.slug}", idType: SLUG) {
        featuredImage {
            node {
            altText
            guid
            mediaDetails {
                width
                height
            }
            }
        }
        title
        content
        }
    }`;

    try {
        const response = await fetch(`${graphQlPath}?query=${query}`);
        if (!response.ok) {
            throw new Error('Problem!');
        }
        const jsonData = await response.json();
        post = jsonData.data.post;
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            post,
        },
        revalidate: 3600, // Einmal pro Stunde aktualisieren
    };
}

export default function BlogPost({ post }) {
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-pages
    const router = useRouter();
    if (router.isFallback) {
        return (
            <Layout>
                <strong>Wird geladen…</strong>
            </Layout>
        );
    }
    const { title, content, featuredImage } = post;
    return (
        <Layout title={title}>
            {featuredImage && (
                <Image
                    src={featuredImage.node.guid}
                    alt={featuredImage.node.altText}
                    width={featuredImage.node.mediaDetails.width}
                    height={featuredImage.node.mediaDetails.height}
                    sizes="(max-width: 52rem) 90vw, 48rem"
                />
            )}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </Layout>
    );
}
