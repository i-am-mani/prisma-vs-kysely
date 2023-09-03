import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { fetch } from "undici";
import { DB } from "../db/types";

// Connect using a DATABASE_URL, provide a fetch implementation
export const kysely = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
    fetch,
  }),
  log(e) {
    if (e.level === "query") {
      console.log({
        from: "kysely",
        query: e.query.sql,
        duration: `${e.queryDurationMillis.toFixed(2)}ms`,
      });
    }
  },
});
