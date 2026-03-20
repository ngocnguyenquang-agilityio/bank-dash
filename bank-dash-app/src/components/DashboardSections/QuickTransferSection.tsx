// Components
import { QuickTransfer } from '@/components/QuickTransfer';

// Services
import { getMembersEffect } from '@/services/members.effect';
import { getMemberByClerkId } from '@/services/members';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';
import { requireAuth } from '@/lib/auth';

export const QuickTransferSection = async () => {
  const userId = await requireAuth();

  const [membersResult, currentMemberResult] = await Promise.all([
    runServerEffect(getMembersEffect(userId)),
    getMemberByClerkId(userId),
  ]);

  if (membersResult.error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{membersResult.error}</p>
      </div>
    );
  }

  const members = [...(membersResult.members?.data ?? [])];
  const senderName = currentMemberResult.member?.name ?? 'User';

  return <QuickTransfer userClerkId={userId} senderName={senderName} members={members} />;
};
