import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql/web';
import { relations } from '../src/db/relations.ts';
import data from './data.ts';
import schema from '../src/db/schema.ts';

if (!process.env.BUNNY_DATABASE_URL || !(process.env.BUNNY_DATABASE_READ_ONLY_AUTH_TOKEN || process.env.BUNNY_DATABASE_AUTH_TOKEN)) throw new Error("Missing required environment variables");

const client = createClient({ url: process.env.BUNNY_DATABASE_URL, authToken: process.env.BUNNY_DATABASE_READ_ONLY_AUTH_TOKEN || process.env.BUNNY_DATABASE_AUTH_TOKEN });

const db = drizzle({ client: client, relations: relations });

await db.batch([
    db.insert(schema.environment).values(data.environments).onConflictDoNothing(),
    db.insert(schema.owner).values(data.owners).onConflictDoNothing(),
    db.insert(schema.gallery).values(data.galleries).onConflictDoNothing(),
    db.insert(schema.site).values(data.sites).onConflictDoNothing(),
    db.insert(schema.credit).values(data.credits).onConflictDoNothing(),
    db.insert(schema.photo).values(data.photos).onConflictDoNothing(),
    db.insert(schema.link).values(data.links).onConflictDoNothing(),
    db.insert(schema.ownerSite).values(data.ownerSites).onConflictDoNothing(),
]);