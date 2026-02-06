"use client";

import { ListBox } from "@repo/ui/heroui";
import { usePathname } from "next/navigation";

// Define navigation items here for scalability
const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Dashboard Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    key: "youtube-tool",
    label: "Youtube Tool",
    href: "/dashboard/youtube-captions",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>YouTube Tool Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col h-full bg-background border-r border-default-200 ${className}`}
    >
      {/* Brand / Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-default-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Mastra Logo</title>
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
            </svg>
          </div>
          <span>Mastra</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4">
        <ListBox aria-label="Navigation" className="p-0 gap-2">
          {navItems.map((item) => (
            <ListBox.Item
              key={item.key}
              textValue={item.label}
              href={item.href}
              className={`px-3 py-2 rounded-lg data-[hover=true]:bg-default-100 ${
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-default-600"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </ListBox.Item>
          ))}
        </ListBox>
      </div>

      {/* Footer Area (Optional) - Removed as requested */}
    </div>
  );
}
