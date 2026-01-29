// Libraries
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Components
import { HomePageWrapper } from '@/components/HomePageWrapper/HomePageWrapper';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return <HomePageWrapper />;
}
