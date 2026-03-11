// Libraries
import { redirect } from 'next/navigation';

// Utils
import { getAuth } from '@/lib/auth';

// Components
import { SettingPageContent } from '@/components/SettingPageContent';

// Services
import { getMemberByClerkId } from '@/services/members';

// Constants
import { ROUTES } from '@/constants/route';

// Utils
import { createMetadata } from '@/utils';

export const metadata = createMetadata(
  'Setting',
  'Manage your account preferences, profile, and security settings',
);

const SettingPage = async () => {
  const { userId } = await getAuth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const { member } = await getMemberByClerkId(userId);

  return <SettingPageContent initialData={member} />;
};

export default SettingPage;
