'use client';
import dynamic from 'next/dynamic';

const InterviewRoom = dynamic(
  () => import('../../../../views/InterviewRoom').then((mod) => mod.InterviewRoom),
  { ssr: false }
);

export default function InterviewRoomPage() { return <InterviewRoom />; }
