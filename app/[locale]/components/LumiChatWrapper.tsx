'use client';

import dynamic from 'next/dynamic';

const LumiChat = dynamic(() => import('./LumiChat'), { ssr: false });

export default function LumiChatWrapper() {
  return <LumiChat />;
}
