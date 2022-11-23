import Layout from '../components/Layout';
import ShuffleText from '@/components/ShuffleText';
// import NewsList from '@/components/NewsList';

export default function Home() {
  return (
    <Layout title="start">
      <div >
        <ShuffleText />
        {/* <NewsList /> */}
      </div>
    </Layout>
  )
}
