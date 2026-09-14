import { type InferInsertModel } from 'drizzle-orm';
import schema from '../src/db/schema.ts';

export const owners: InferInsertModel<typeof schema.owner>[] = [
  { key: 'owner-one', name: 'owner-one', pronouns: 'she/her', icon: 'owner-one-icon.png' },
  { key: 'owner-two', name: 'owner-two', pronouns: 'he/him', icon: 'owner-two-icon.png' },
  { key: 'owner-three', name: 'owner-three', pronouns: 'they/them', icon: null },
  { key: 'owner-four', name: 'owner-four', pronouns: null, icon: null },
];

export const ownerSites: InferInsertModel<typeof schema.ownerSite>[] = [
  { key: 'owner-one-patreon', uri: 'https://patreon.com/example-owner-one', type: 'external', ownerKey: 'owner-one', siteKey: 'patreon' },
  { key: 'owner-one-bsky', uri: 'https://bsky.app/profile/example-owner-one.bsky.social', type: 'external', ownerKey: 'owner-one', siteKey: 'bsky' },
  { key: 'owner-two-twitter', uri: 'https://twitter.com/example_owner_two', type: 'external', ownerKey: 'owner-two', siteKey: 'twitter' },
  { key: 'owner-two-website', uri: 'https://example-owner-two.example', type: 'external', ownerKey: 'owner-two', siteKey: 'website' },
  { key: 'owner-four-twitch', uri: 'https://twitch.tv/example_owner_four', type: 'external', ownerKey: 'owner-four', siteKey: 'twitch' },
];

export const photos: InferInsertModel<typeof schema.photo>[] = [
  { key: 'example-landscape-photo', name: null, uri: 'example-landscape-photo.png', visible: true, ownerKey: 'owner-one', galleryKey: 'example-gallery' },
  { key: 'example-portrait-owner-two', name: null, uri: 'example-portrait-owner-two.png', visible: true, ownerKey: 'owner-two', galleryKey: 'example-gallery' },
  { key: 'example-portrait-owner-three', name: null, uri: 'example-portrait-owner-three.png', visible: true, ownerKey: 'owner-three', galleryKey: 'example-gallery' },
  { key: 'example-moodboard-one', name: null, uri: 'example-moodboard-one.jpg', visible: true, ownerKey: 'owner-four', galleryKey: 'example-moodboard' },
  { key: 'example-moodboard-two', name: null, uri: 'example-moodboard-two.jpg', visible: true, ownerKey: 'owner-two', galleryKey: 'example-moodboard' },
];

export const credits: InferInsertModel<typeof schema.credit>[] = [
  { key: 'example-shoot-credit', title: 'Example credit', description: null, ownerKey: 'owner-one' },
];

export const galleries: InferInsertModel<typeof schema.gallery>[] = [
  { key: 'example-gallery', name: 'Example Gallery', description: 'Example photo gallery', visible: true },
  { key: 'example-moodboard', name: 'Example Moodboard', description: 'Example photos used for inspiration', visible: true },
];

export const links: InferInsertModel<typeof schema.link>[] = [
  {
    key: 'bsky',
    uri: 'https://bsky.app/profile/example.social',
    type: 'external',
    name: 'bsky',
    style: '{"backgroundColor":"rgb(var(--bsky) / 0.8)","&:hover":{"backgroundColor":"var(--bsky-blue)"},"&:active":{"backgroundColor":"var(--bsky-blue-active)"}}',
    siteKey: 'bsky',
  },
  {
    key: 'twitter',
    uri: 'https://twitter.com/example',
    type: 'external',
    name: 'twitter',
    style: '{"backgroundColor":"rgb(var(--twitter) / 0.8)","&:hover":{"backgroundColor":"var(--twitter-blue)"},"&:active":{"backgroundColor":"var(--twitter-blue-active)"}}',
    siteKey: 'twitter',
  },
  { key: 'gallery', uri: '/gallery', type: 'internal', name: 'gallery', style: null, siteKey: null },
  { key: 'credits', uri: '/credits', type: 'internal', name: 'credits', style: null, siteKey: null },
];

export const sites: InferInsertModel<typeof schema.site>[] = [
  { key: 'patreon', name: 'Patreon', icon: 'patreon-logo.svg', style: null },
  { key: 'bsky', name: 'Bluesky', icon: 'bsky-logo.svg', style: '{"filter":"grayscale(1)"}' },
  { key: 'twitter', name: 'Twitter', icon: 'twitter-logo.svg', style: null },
  { key: 'twitch', name: 'Twitch', icon: 'twitch-white-logo.svg', style: null },
  { key: 'website', name: 'Website', icon: null, style: null },
];

export const environments: InferInsertModel<typeof schema.environment>[] = [
  {
    key: 'prod',
    config: {
      baseMediaUrl: 'https://cdn.example.com/media',
      baseAssetsUrl: 'https://cdn.example.com/assets',
      features: {
        settingsPopover: true,
        moodboardGallery: true,
      },
    },
  },
  {
    key: 'stage',
    config: {
      baseMediaUrl: 'https://cdn.example.com/media',
      baseAssetsUrl: 'https://cdn.example.com/assets',
      features: {
        settingsPopover: true,
        moodboardGallery: true,
      },
    },
  },
];

export default { owners, sites, galleries, photos, links, ownerSites, credits, environments };