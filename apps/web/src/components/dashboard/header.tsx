"use client";

import { Button } from "@repo/ui/heroui";
import { UserNav } from "./user-nav";

interface HeaderProps {
  onMobileMenuOpen: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ onMobileMenuOpen, user }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-default-200 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <Button
          isIconOnly
          variant="ghost"
          className="lg:hidden text-default-600"
          onPress={onMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Menu Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        {/* Breadcrumb / Title placeholder */}
        <h2 className="text-lg font-semibold text-foreground hidden sm:block">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  );
}
