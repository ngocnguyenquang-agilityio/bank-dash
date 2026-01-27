"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendIcon, ChevronRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

const contacts = [
  { name: "Livia Bator", role: "CEO", avatar: "LB" },
  { name: "Randy Press", role: "Director", avatar: "RP" },
  { name: "Workman", role: "Designer", avatar: "W" },
];

export const QuickTransfer = () => {
  return (
    <Card className="w-full rounded-[25px] border-0 outline-none shadow-none">
      <CardContent className="px-4 py-6 flex flex-col gap-6">
        {/* Contacts */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-7 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-6">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 flex-shrink-0"
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
                  <div className="text-xs sm:text-[15px] text-neutral-30">
                    {contact.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See More */}
          <Button
            variant="ghost"
            size="md"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px] px-0 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center flex-shrink-0"
            aria-label="See more"
          >
            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-30" />
          </Button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2 sm:space-y-3">
          <Label
            htmlFor="amount"
            className="text-sm sm:text-[16px] text-neutral-30"
          >
            Write Amount
          </Label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-stretch sm:items-center">
            <div className="flex-1 h-12 sm:h-[50px] bg-neutral-20 rounded-[50px] px-5 sm:px-7 flex items-center">
              <input
                id="amount"
                type="text"
                placeholder="525.50"
                className="bg-transparent border-0 outline-none text-sm sm:text-[16px] text-neutral-30 w-full placeholder:text-neutral-30"
              />
            </div>
            <Button className="h-12 sm:h-[50px] px-5 sm:px-6 rounded-[50px] bg-blue-50 hover:bg-blue-50/90 text-white gap-2 shadow-lg">
              <span className="font-medium text-sm sm:text-[16px]">Send</span>
              <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
