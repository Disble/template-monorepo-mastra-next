"use client";

import { Avatar, Dropdown } from "@repo/ui/heroui";
import { useRouter } from "next/navigation";
import { authClient } from "#lib/auth-client";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login"); // Redirect to login after sign out
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar className="transition-transform" color="accent" size="sm">
          <Avatar.Image src={user.image || undefined} />
          <Avatar.Fallback>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="User Actions"
          className="w-64 p-2 bg-background/80 backdrop-blur-xl border border-default-200 shadow-xl rounded-xl"
        >
          <Dropdown.Section>
            <Dropdown.Item
              key="profile"
              textValue="Signed in as"
              className="h-14 gap-2 opacity-100 mb-2 flex"
            >
              <p className="font-semibold text-default-600">
                Signed in as:{" "}
                <span className="font-semibold text-foreground truncate">
                  {user.email}
                </span>
              </p>
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Item
            key="settings"
            textValue="My Settings"
            className="rounded-lg data-[hover=true]:bg-default-100"
          >
            My Settings
          </Dropdown.Item>
          <Dropdown.Item
            key="help_and_feedback"
            textValue="Help & Feedback"
            className="rounded-lg data-[hover=true]:bg-default-100"
          >
            Help & Feedback
          </Dropdown.Item>
          <Dropdown.Item
            key="logout"
            className="text-danger rounded-lg data-[hover=true]:bg-danger/10 data-[hover=true]:text-danger"
            onPress={handleSignOut}
            textValue="Log Out"
          >
            Log Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
