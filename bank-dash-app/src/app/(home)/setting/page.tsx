// Utils
import { requireAuth } from '@/lib/auth';

// Components
import { SettingPageContent } from '@/components/SettingPageContent';

// Services
import { getMemberByClerkId } from '@/services/members';

// Utils
import { createMetadata } from '@/utils';

export const metadata = createMetadata(
  'Setting',
  'Manage your account preferences, profile, and security settings',
);

const SettingPage = async () => {
  const userId = await requireAuth();

  const { member } = await getMemberByClerkId(userId);

  return <SettingPageContent initialData={member} />;
};

export default SettingPage;
