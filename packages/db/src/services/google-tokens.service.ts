import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { account } from "../schema/users";

export async function getGoogleTokens(userId: string) {
  const [googleAccount] = await db
    .select({
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      expiresAt: account.accessTokenExpiresAt,
      scope: account.scope,
    })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "google")))
    .limit(1);

  return googleAccount ?? null;
}
