import { defineRelations } from 'drizzle-orm';
import schema from './schema.ts';

export const relations = defineRelations(schema, r => ({
  owner: {
    credits: r.many.credit({
      from: r.owner.key,
      to: r.credit.ownerKey,
    }),
    photos: r.many.photo({
      from: r.owner.key,
      to: r.photo.ownerKey,
    }),
    links: r.many.ownerSite({
      from: r.owner.key,
      to: r.ownerSite.ownerKey,
    }),
    galleries: r.many.gallery({
      from: r.owner.key.through(r.photo.ownerKey),
      to: r.gallery.key.through(r.photo.galleryKey)
    }),
  },
  ownerSite: {
    owner: r.one.owner({
      from: r.ownerSite.ownerKey,
      to: r.owner.key
    }),
    site: r.one.site({
      from: r.ownerSite.siteKey,
      to: r.site.key,
      optional: false,
    })
  },
  photo: {
    owner: r.one.owner({
      from: r.photo.ownerKey,
      to: r.owner.key,
    }),
    gallery: r.one.gallery({
      from: r.photo.galleryKey,
      to: r.gallery.key,
    }),
  },
  gallery: {
    photos: r.many.photo({
      from: r.gallery.key,
      to: r.photo.galleryKey
    }),
    owners: r.many.owner({
      from: r.gallery.key.through(r.photo.galleryKey),
      to: r.owner.key.through(r.photo.ownerKey)
    }),
  },
}));