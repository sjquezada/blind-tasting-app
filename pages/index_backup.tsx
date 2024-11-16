// pages/index.tsx
import React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the BlindTastingApp with no SSR
const BlindTastingApp = dynamic(
  () => import('../src/components/BlindTastingApp'),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BlindTastingApp />
    </div>
  );
};

export default Home;