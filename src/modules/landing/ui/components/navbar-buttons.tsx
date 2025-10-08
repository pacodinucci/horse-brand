"use client";

import { useState } from "react";
import { CartButton } from "./cart-button";
import { Search as SearchIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const NavbarButtons = () => {
  const [q, setQ] = useState("");

  const goSearch = () => {
    if (!q.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <div className="flex gap-x-6 items-center justify-center">
      <HoverCard openDelay={80} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            aria-label="Búsqueda"
            className="grid place-items-center rounded-full w-8 h-8 hover:bg-black/5 transition"
            title="Búsqueda"
          >
            <SearchIcon className="h-5 w-5 text-neutral-300" />
          </button>
        </HoverCardTrigger>

        <HoverCardContent
          side="bottom"
          align="end"
          sideOffset={10}
          className="p-0 border shadow-xl rounded-2xl w-[360px] bg-white mt-10"
        >
          <div className="relative p-6">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
              placeholder="Búsqueda de productos"
              className="pr-10 h-10 rounded-xl text-[15px] placeholder:text-neutral-400
                        bg-white
                        border-0 border-transparent
                        outline-none
                        ring-0 focus:ring-0 focus-visible:ring-0
                        ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0
                        shadow-none focus:shadow-none
                        [box-shadow:none] focus:[box-shadow:none]"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={goSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 hover:bg-transparent"
              aria-label="Buscar"
            >
              <SearchIcon className="h-5 w-5 text-neutral-500" />
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>

      <CartButton />
    </div>
  );
};
