'use client';

// Libraries
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons/Icons';

// Services
import { sendAmount } from '@/services/transfers';

// Utils
import { getInitials } from '@/utils';

// Types
import type { Member } from '@/types/member';

// Constants
import { TRANSACTION_ERRORS } from '@/constants/error';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:1337';

interface QuickTransferProps {
  userClerkId: string;
  senderName: string;
  members: Member[];
}

export const QuickTransfer = ({ userClerkId, senderName, members }: QuickTransferProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showPrevButton, setShowPrevButton] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const atStart = container.scrollLeft <= 0;
    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    setShowPrevButton(!atStart);
    setShowNextButton(!atEnd);
  }, []);

  useEffect(() => {
    checkScrollPosition();
  }, [members, checkScrollPosition]);

  const handleScrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
  };

  const handleScrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const disabledMemberIds = useMemo(() => {
    const ids = new Set<string>();

    for (const member of members) {
      const hasActiveCard = member.cards?.some((card) => card.isActive) ?? false;

      if (!hasActiveCard) {
        ids.add(member.documentId);
      }
    }

    return ids;
  }, [members]);

  const selectableMember = useMemo(
    () => members.filter((m) => !disabledMemberIds.has(m.documentId)),
    [members, disabledMemberIds],
  );

  // Auto-select the first selectable member
  const activeSelectedMember = useMemo(() => {
    if (selectedMember && !disabledMemberIds.has(selectedMember.documentId)) {
      return selectedMember;
    }

    return selectableMember[0] ?? null;
  }, [selectedMember, selectableMember, disabledMemberIds]);

  const handleSelectMember = (member: Member) => {
    if (disabledMemberIds.has(member.documentId)) return;
    setSelectedMember(member);
  };

  const handleSend = () => {
    setError(null);

    if (!activeSelectedMember) {
      setError(TRANSACTION_ERRORS.RECIPIENT_NOT_FOUND);
      return;
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(TRANSACTION_ERRORS.INVALID_AMOUNT);
      return;
    }

    // Call API — two-sided transfer with compensating rollback
    startTransition(async () => {
      const result = await sendAmount(
        userClerkId,
        activeSelectedMember.clerkId,
        numericAmount,
        senderName,
        activeSelectedMember.name,
      );

      if (!result.success) {
        setError(result.error || TRANSACTION_ERRORS.FAILED_TRANSACTION);
        return;
      }

      // Clear input and refresh data
      setAmount('');
      router.refresh();
    });
  };

  const getMemberPhotoUrl = (member: Member): string | undefined => {
    if (!member.photo?.url) return undefined;

    // If the URL is already absolute, return as-is
    if (member.photo.url.startsWith('http')) return member.photo.url;

    // Prefix with Strapi base URL for relative paths
    return `${STRAPI_BASE_URL}${member.photo.url}`;
  };

  return (
    <Card className="w-full flex-1 rounded-[25px] border-0 outline-none shadow-none overflow-hidden">
      <CardContent className="px-4 py-6 flex flex-col justify-between h-full gap-6">
        {/* Members */}
        <div className="relative w-full overflow-hidden">
          {/* See Previous */}
          <Button
            variant="ghost"
            size="md"
            onClick={handleScrollPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px] px-0 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-opacity duration-200 ${
              showPrevButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="See previous"
          >
            <Icons.ChevronBackward className="w-5 h-5 sm:w-6 sm:h-6 fill-neutral-30" />
          </Button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex items-center gap-6 overflow-x-hidden w-full"
          >
            {members.map((member) => {
              const isDisabled = disabledMemberIds.has(member.documentId);
              const isSelected = activeSelectedMember?.documentId === member.documentId;

              return (
                <Button
                  key={member.documentId}
                  variant="ghost"
                  onClick={() => handleSelectMember(member)}
                  disabled={isDisabled}
                  className={`flex flex-col items-center gap-2 flex-shrink-0 p-3 h-auto rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-transparent border-2 border-blue-50 shadow-md'
                      : 'border-2 border-transparent hover:bg-black/5'
                  } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <Avatar className="w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]">
                    {getMemberPhotoUrl(member) && (
                      <AvatarImage src={getMemberPhotoUrl(member)!} alt={`${member.name} avatar`} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="font-semibold text-sm sm:text-[16px] text-black whitespace-nowrap">
                      {member.name}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* See More */}
          <Button
            variant="ghost"
            size="md"
            onClick={handleScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px] px-0 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-opacity duration-200 ${
              showNextButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="See more"
          >
            <Icons.ChevronForwardIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-neutral-30" />
          </Button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="amount" className="text-sm sm:text-[16px] text-neutral-30">
            Write Amount
          </Label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-stretch sm:items-center">
            <div className="flex-1 h-12 sm:h-[50px] bg-neutral-20 rounded-[50px] px-5 sm:px-7 flex items-center">
              <input
                id="amount"
                type="text"
                placeholder="525.50"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  // Only allow numbers and one decimal point
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setAmount(val);
                    setError(null);
                  }
                }}
                disabled={isPending}
                className="bg-transparent border-0 outline-none text-sm sm:text-[16px] text-tx-primary w-full placeholder:text-neutral-30 disabled:opacity-50"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={isPending || !userClerkId || !activeSelectedMember}
              className="h-12 sm:h-[50px] px-5 sm:px-6 rounded-[50px] bg-blue-50 hover:bg-blue-50/90 text-white gap-2 shadow-lg disabled:opacity-50"
            >
              {isPending ? (
                <Icons.Process className="w-4 h-4 sm:w-5 sm:h-5 animate-spin fill-white" />
              ) : (
                <>
                  <span className="font-medium text-sm sm:text-[16px]">Send</span>
                  <Icons.Send className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
