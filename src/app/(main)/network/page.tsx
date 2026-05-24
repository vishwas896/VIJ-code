'use client';
import dynamic from 'next/dynamic';

const GlobalNetwork = dynamic(
  () => import('../../../views/GlobalNetwork').then((mod) => mod.GlobalNetwork),
  { ssr: false }
);

export default function NetworkPage() {
  return <GlobalNetwork />;
}
