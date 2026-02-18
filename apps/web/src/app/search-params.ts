import { parseAsInteger, parseAsString } from "nuqs/server";

export const runIdSearchParams = {
  runId: parseAsString.withDefault(""),
};

export const paginationSearchParams = {
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(""),
};
