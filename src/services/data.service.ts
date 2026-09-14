import { inject, singleton } from 'fast-injection/decorators';
import { Cache, type ICache } from '../core/cache.ts';
import { DatabaseContext } from '../db/database.ts';
import { type IOwner, type IEnvironment, type IGallery, type IGalleryItem, type ILink } from '../interfaces/models.ts';
import { IConfig } from '../interfaces/models.ts';

@singleton()
class DataService {
  constructor(
    @inject(IConfig) protected deployEnv: IConfig,
    @inject(DatabaseContext) protected database: DatabaseContext,
    @inject(Cache) protected cache: ICache
  ) {}

  getCurrentEnv = async (): Promise<IEnvironment> => {
    const environmentKey = this.deployEnv.env.toString();
    const env = this.database.db.query.environment.findFirst({ where: { key: { eq: environmentKey } } });

    return (
      await this.cache.getOrSet<IEnvironment>(Cache.key(['environment', environmentKey]), async () => {
        const envResult = await env;
        if (!envResult) throw new Error(`Environment with key ${environmentKey} not found`);
        return envResult;
      })
    ).value;
  };

  getOwners = async (): Promise<IOwner[]> => {
    const owners = await this.database.db.query.owner.findMany({
      columns: {
        key: true,
        name: true,
        icon: true,
        pronouns: true,
      },
      with: {
        links: {
          columns: {
            key: true,
            type: true,
            uri: true,
          },
          with: {
            site: {
              columns: {
                key: true,
                name: true,
                icon: true,
                style: true,
              },
            },
          },
        },
      },
    });

    return owners.map(owner => ({
      key: owner.key,
      name: owner.name,
      icon: owner.icon ?? undefined,
      pronouns: owner.pronouns ?? undefined,
      links:
        owner.links.map<ILink>(link => ({
          key: link.key,
          type: link.type,
          uri: link.uri,
          icon: link.site.icon ?? undefined,
          name: link.site.name,
          style: link.site.style ?? undefined,
        })) ?? [],
    }));
  };

  getGalleries = async (): Promise<IGallery[]> => {
    const environment = await this.getCurrentEnv();
    
    const galleries = await this.database.db.query.gallery.findMany({
      columns: { key: true, name: true, description: true, visible: true },
      with: {
        photos: {
          columns: { key: true, uri: true },
          with: {
            owner: {
              columns: { key: true, name: true, pronouns: true, icon: true },
              with: {
                links: {
                  limit: 1,
                  columns: { key: true, type: true, uri: true },
                  with: {
                    site: {
                      columns: { key: true, name: true, icon: true, style: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (galleries.some(gallery => gallery.photos.some(photo => photo.owner === null))) {
      throw new Error('One or more photos are missing associated owner data');
    }

    return galleries.map(gallery => ({
      key: gallery.key,
      name: gallery.name,
      description: gallery.description ?? undefined,
      visible: gallery.visible,
      photos: gallery.photos.map<IGalleryItem>(photo => ({
        key: photo.key,
        image: {
          original: `${environment.config.baseAssetsUrl}/${photo.uri}`,
          thumbnail: `${environment.config.baseMediaUrl}/256/${photo.uri}`,
          metadata: {
            name: photo.key,
          },
        },
        owner: {
          key: photo.owner!.key,
          name: photo.owner!.name,
          pronouns: photo.owner!.pronouns ?? undefined,
          icon: photo.owner!.icon ?? undefined,
          links:
            photo.owner!.links.map<ILink>(link => ({
              key: link.key,
              type: link.type,
              uri: link.uri,
              name: link.site.name,
              icon: link.site.icon ?? undefined,
              style: link.site.style ?? undefined,
            })) ?? [],
        },
      })),
    }));
  };
}

export { DataService };
