import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "#lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}. Manage your content workflows here.
        </p>
      </div>
    </div>
  );
}
