import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';
const LocationFinder = dynamic(() => import('@/components/LocationFinder'), {
  ssr: false,
});

export default function Standorte() {
  return (
    <Layout title="Standorte">
      <LocationFinder />
    </Layout>
  );
}
