import Layout from '@/components/Layout';

// Version mit REST-API:
export async function getStaticProps() {
    let posts = [];

    try {
        const response = await fetch(
            'https://react.webworker.berlin/wp-json/wp/v2/posts'
        );

        if (!response.ok) {
            throw new Error('Problem!');
        }

        posts = await response.json();
    } catch (e) {
        console.log(e);
    }

    return {
        props: {
            posts,
        },
        revalidate: 3600, // Einmal pro Stunde aktualisieren
    };
}

export default function Blog({ posts, slug }) {
    return (
        <Layout title="Blog">
            <ul>
                {posts.map(({ title }) => (
                    <li key={slug}>{title}</li>
                ))}
            </ul>
        </Layout>
    );
}


