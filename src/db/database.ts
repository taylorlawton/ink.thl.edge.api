import { createClient, type Client as SqlClient } from '@libsql/client/web';
import type { AnyRelations, EmptyRelations } from 'drizzle-orm';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { inject, singleton } from 'fast-injection/decorators';
import { relations } from './relations.ts';

type RelationsType = typeof relations;
type DatabaseType = LibSQLDatabase<RelationsType>;

interface IDatabase<TRelations extends AnyRelations = EmptyRelations> {
  db: LibSQLDatabase<TRelations>;
}

const ClientFactory = (url?: string, authToken?: string) => {
  if (!url || !authToken) {
    throw new Error('Missing required environment variables: BUNNY_DATABASE_URL and BUNNY_DATABASE_READ_ONLY_AUTH_TOKEN or BUNNY_DATABASE_AUTH_TOKEN');
  }
  console.info(`🔗 Connecting to database at ${url}`);
  return new Client(url, authToken);
};

@singleton()
class Client {
  client: SqlClient;

  constructor(url: string, authToken: string) {
    this.client = createClient({ url, authToken });
  }
}

@singleton()
class DatabaseContext implements IDatabase<RelationsType> {
  db: DatabaseType;

  constructor(@inject(Client) { client }: Client) {
    this.db = drizzle({ client: client, relations });
  }
}

export { Client, ClientFactory, DatabaseContext };
