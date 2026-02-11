'use client';

// Libraries
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons/Icons';

// Services
import { sendAmount } from '@/services/transfers';

// Constants
import { TRANSACTION_ERRORS } from '@/constants/error';

const contacts = [
  { name: 'Livia Bator', role: 'CEO', avatar: 'LB' },
  { name: 'Randy Press', role: 'Director', avatar: 'RP' },
  { name: 'Workman', role: 'Designer', avatar: 'W' },
];

interface QuickTransferProps {
  cardDocumentId: string;
  cardBalance: string;
}

export const QuickTransfer = ({ cardDocumentId, cardBalance }: QuickTransferProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  const handleSend = () => {
    setError(null);

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError(TRANSACTION_ERRORS.INVALID_AMOUNT);
      return;
    }

    // Check balance
    const balance = parseFloat(cardBalance);
    if (numericAmount > balance) {
      setError(TRANSACTION_ERRORS.INSUFFICIENT_BALANCE);
      return;
    }

    // Call API
    startTransition(async () => {
      const result = await sendAmount(cardDocumentId, numericAmount, selectedContact?.name ?? '');

      if (!result.success) {
        setError(result.error || TRANSACTION_ERRORS.FAILED_TRANSACTION);
        return;
      }

      // Clear input and refresh data
      setAmount('');
      router.refresh();
    });
  };

  return (
    <Card className="w-full rounded-[25px] border-0 outline-none shadow-none">
      <CardContent className="px-4 py-6 flex flex-col gap-6">
        {/* Contacts */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-7 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-6">
            {contacts.map((contact, index) => (
              <Button
                key={index}
                type="button"
                onClick={() => setSelectedContact(contact)}
                className={`flex flex-col items-center gap-2 flex-shrink-0 p-3 rounded-2xl transition-all duration-200 ${
                  selectedContact?.name === contact.name
                    ? 'bg-blue-50/5 border-2 border-blue-50 shadow-md'
                    : 'border-2 border-transparent hover:bg-neutral-10'
                }`}
              >
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${contact.name}`}
                    alt={`${contact.name} avatar`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                    {contact.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-semibold text-sm sm:text-[16px] text-black whitespace-nowrap">
                    {contact.name}
                  </div>
                  <div className="text-xs sm:text-[15px] text-neutral-30">{contact.role}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* See More */}
          <Button
            variant="ghost"
            size="md"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px] px-0 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center flex-shrink-0"
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
              disabled={isPending || !cardDocumentId}
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
