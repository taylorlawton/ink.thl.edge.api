import { env } from 'node:process';
import 'reflect-metadata';
import { ApplicationBuilder } from './core/application.ts';
import { Cache, ICache } from './core/cache.ts';
import { Client, ClientFactory, DatabaseContext } from './db/database.ts';
import { DataService } from './services/data.service.ts';
import { IConfig } from './interfaces/models.ts';

const app = new ApplicationBuilder()
  .withValue(IConfig, { env: env.DEPLOY_ENV! })
  .withFactory<Client>(Client, () => ClientFactory(env.BUNNY_DATABASE_URL, env.BUNNY_DATABASE_READ_ONLY_AUTH_TOKEN || env.BUNNY_DATABASE_AUTH_TOKEN))
  .withService<DatabaseContext>(DatabaseContext)
  .withToken<ICache>(ICache, Cache)
  .withService<DataService>(DataService)
  .withHeader('X-Bunny-Business', () => {
    const ranBusiness = ['mmmmmh, large celery', 'mmmmmh, twenty-four carrot', 'mmmmmh, lettuce back in business', 'mmmmmh, hopping to find egg salad bugers'];
    return ranBusiness[Math.floor(Math.random() * ranBusiness.length)];
  })
  .build();

app.route('/api/owners', async (_request: Request): Promise<Response> => {
  const dataService = app.resolve<DataService>(DataService);
  const owners = await dataService.getOwners();

  return Response.json(owners);
});

app.route('/api/galleries', async (_request: Request): Promise<Response> => {
  const dataService = app.resolve<DataService>(DataService);
  const galleries = await dataService.getGalleries();

  return Response.json(galleries);
});

const port = env.BUNNY_EDGE_PORT ? parseInt(env.BUNNY_EDGE_PORT) : undefined;
const hostname = env.BUNNY_EDGE_HOSTNAME;

export default app.serve(port && hostname ? { hostname, port } : undefined);
