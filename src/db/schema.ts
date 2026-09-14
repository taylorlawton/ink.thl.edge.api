import { sql } from 'drizzle-orm';
import { check, foreignKey, integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

interface IEnvironment {
  baseMediaUrl: string;
  baseAssetsUrl: string;
  features?: {
    moodboardGallery?: boolean;
    settingsPopover?: boolean;
  }
}

export const owner = sqliteTable(
  'owner',
  {
    key: text('key').notNull(),
    name: text('name').notNull(),
    pronouns: text('pronouns'),
    icon: text('icon'),
  },
  table => [primaryKey({ name: 'owner_key_pkey', columns: [table.key] }), unique('owner_name_key').on(table.name)]
);

export const gallery = sqliteTable(
  'gallery',
  {
    key: text('key').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    visible: integer('visible', { mode: 'boolean' }).notNull(),
  },
  table => [primaryKey({ name: 'gallery_key_pkey', columns: [table.key] }), unique('gallery_name_key').on(table.name), check('gallery_visible_check', sql`${table.visible} IN (0, 1)`)]
);

export const environment = sqliteTable(
  'environment',
  {
    key: text('key').notNull(),
    config: text('config', { mode: 'json' }).$type<IEnvironment>().notNull(),
  },
  table => [primaryKey({ name: 'environment_key_pkey', columns: [table.key] })]
);

export const site = sqliteTable(
  'site',
  {
    key: text('key').notNull(),
    name: text('name').notNull(),
    icon: text('icon'),
    style: text('style'),
  },
  table => [primaryKey({ name: 'site_key_pkey', columns: [table.key] }), unique('site_name_key').on(table.name)]
);

export const credit = sqliteTable(
  'credit',
  {
    key: text('key').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    ownerKey: text('owner_key').notNull(),
  },
  table => [
    primaryKey({ name: 'credit_key_pkey', columns: [table.key] }),
    unique('credit_title_key').on(table.ownerKey, table.title),
    foreignKey({ columns: [table.ownerKey], foreignColumns: [owner.key], name: 'credit_owner_key_fkey' }).onDelete('cascade'),
  ]
);

export const photo = sqliteTable(
  'photo',
  {
    key: text('key').notNull(),
    name: text('name'),
    uri: text('uri').notNull(),
    visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
    ownerKey: text('owner_key').notNull(),
    galleryKey: text('gallery_key'),
  },
  table => [
    primaryKey({ name: 'photo_key_pkey', columns: [table.key] }),
    unique('photo_uri_key').on(table.uri, table.galleryKey),
    check('photo_visible_check', sql`${table.visible} IN (0, 1)`),
    foreignKey({ columns: [table.ownerKey], foreignColumns: [owner.key], name: 'photo_owner_key_fkey' }).onDelete('cascade'),
    foreignKey({ columns: [table.galleryKey], foreignColumns: [gallery.key], name: 'photo_gallery_key_fkey' }).onDelete('cascade'),
  ]
);

export const link = sqliteTable(
  'link',
  {
    key: text('key').notNull(),
    uri: text('uri').notNull(),
    type: text('type', { enum: ['internal', 'external'] }).notNull(),
    name: text('name').notNull(),
    style: text('style'),
    siteKey: text('site_key'),
  },
  table => [
    primaryKey({ name: 'link_key_pkey', columns: [table.key] }),
    unique('link_uri_key').on(table.uri, table.siteKey),
    check('link_type_check', sql`${table.type} IN ('internal', 'external')`),
    foreignKey({ columns: [table.siteKey], foreignColumns: [site.key], name: 'link_site_key_fkey' }).onDelete('cascade'),
  ]
);

export const ownerSite = sqliteTable(
  'owner_site',
  {
    key: text('key').notNull(),
    uri: text('uri').notNull(),
    type: text('type', { enum: ['internal', 'external'] }).notNull(),
    ownerKey: text('owner_key').notNull(),
    siteKey: text('site_key').notNull(),
  },
  table => [
    primaryKey({ name: 'owner_site_key_pkey', columns: [table.key] }),
    unique('owner_site_uri_key').on(table.uri, table.siteKey),
    check('owner_site_type_check', sql`${table.type} IN ('internal', 'external')`),
    foreignKey({ columns: [table.ownerKey], foreignColumns: [owner.key], name: 'owner_site_owner_key_fkey' }).onDelete('cascade'),
    foreignKey({ columns: [table.siteKey], foreignColumns: [site.key], name: 'owner_site_site_key_fkey' }).onDelete('cascade'),
  ]
);

export default { owner, credit, photo, gallery, link, site, ownerSite, environment };