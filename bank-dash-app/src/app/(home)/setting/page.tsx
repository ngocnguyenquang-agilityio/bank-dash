// Libraries
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Components
import { SettingPageContent } from '@/components/SettingPageContent';

// Services
import { getMemberByClerkId } from '@/services/members';

// Constants
import { ROUTES } from '@/constants/route';

const SettingPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const { member } = await getMemberByClerkId(userId);

  return <SettingPageContent initialData={member} />;
};

export default SettingPage;
