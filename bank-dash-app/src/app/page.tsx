// Libraries
import { redirect } from 'next/navigation';

// Utils
import { getAuth } from '@/lib/auth';

// Components
import { HomePageWrapper } from '@/components/HomePageWrapper/HomePageWrapper';

export default async function HomePage() {
  const { userId } = await getAuth();

  if (userId) {
    redirect('/dashboard');
  }

  return <HomePageWrapper />;
}
