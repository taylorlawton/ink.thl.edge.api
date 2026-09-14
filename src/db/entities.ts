import { type InferSelectModel } from 'drizzle-orm';
import schema from './schema.ts';

type Owner = InferSelectModel<typeof schema.owner>;
type Gallery = InferSelectModel<typeof schema.gallery>;
type Site = InferSelectModel<typeof schema.site>;
type Credit = InferSelectModel<typeof schema.credit>;
type Photo = InferSelectModel<typeof schema.photo>;
type Link = InferSelectModel<typeof schema.link>;
type OwnerSite = InferSelectModel<typeof schema.ownerSite>;
type Environment = InferSelectModel<typeof schema.environment>;

export type { Owner, Gallery, Site, Credit, Photo, Link, OwnerSite, Environment };