// Libraries
import { auth } from '@clerk/nextjs/server';

// Services
import { getMemberByClerkId } from '@/services/members';

// Utils
import { getInitials, getStrapiMedia } from '@/utils';

// Components
import { DashboardHeaderContent } from './DashboardHeaderContent';

export const DashboardHeader = async () => {
  const { userId } = await auth();

  let memberName = 'User';
  let memberInitials = 'U';
  let memberImageUrl = '';

  if (userId) {
    const { member } = await getMemberByClerkId(userId);
    memberName = member?.name || 'User';
    memberInitials = getInitials(memberName);
    memberImageUrl = getStrapiMedia(member?.photo?.url) ?? '';
  }

  return (
    <DashboardHeaderContent
      memberName={memberName}
      memberInitials={memberInitials}
      memberImageUrl={memberImageUrl}
    />
  );
};
