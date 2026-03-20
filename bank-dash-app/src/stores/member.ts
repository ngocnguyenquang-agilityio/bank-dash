'use client';

// Libraries
import { create } from 'zustand';
import { useRef } from 'react';

// Types
import type { Member } from '@/types/member';

// Utils
import { getInitials, getStrapiMedia } from '@/utils';

interface MemberState {
  member: Member | null;
  memberName: string;
  memberInitials: string;
  memberImageUrl: string;
  updateMemberData: (updatedFields: Partial<Member>) => void;
  hydrate: (member: Member | null) => void;
}

const computeDerived = (
  member: Member | null,
): { memberName: string; memberInitials: string; memberImageUrl: string } => {
  const memberName = member?.name || 'User';
  return {
    memberName,
    memberInitials: getInitials(memberName),
    memberImageUrl: getStrapiMedia(member?.photo?.url) ?? '',
  };
};

export const useMemberStore = create<MemberState>()((set) => ({
  member: null,
  memberName: 'User',
  memberInitials: getInitials('User'),
  memberImageUrl: '',

  updateMemberData: (updatedFields: Partial<Member>) => {
    set((state) => {
      if (!state.member) return state;
      const updatedMember = { ...state.member, ...updatedFields };
      return {
        member: updatedMember,
        ...computeDerived(updatedMember),
      };
    });
  },

  hydrate: (member: Member | null) => {
    set({
      member,
      ...computeDerived(member),
    });
  },
}));

interface MemberStoreHydratorProps {
  initialMember: Member | null;
}

export const MemberStoreHydrator = ({ initialMember }: MemberStoreHydratorProps) => {
  const hydrated = useRef(false);

  if (!hydrated.current) {
    hydrated.current = true;
    useMemberStore.getState().hydrate(initialMember);
  }

  return null;
};
