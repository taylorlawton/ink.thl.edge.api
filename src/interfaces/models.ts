const IConfig = Symbol('IConfig');
interface IConfig {
  env: string;
}

export interface IOwner {
  key: string;
  name: string;
  pronouns?: string;
  icon?: string;
  links: ILink[];
}
export interface IEnvironment {
  key: string;
  config: {
    baseMediaUrl: string;
    baseAssetsUrl: string;
    features?: {
      moodboardGallery?: boolean;
      settingsPopover?: boolean;
    };
  };
}

export interface IGallery {
  key: string;
  name: string;
  description?: string;
  visible: boolean;
  photos: IGalleryItem[];
}

export interface IGalleryItem {
  key: string;
  image: {
    original: string;
    thumbnail: string;
    metadata: {
      name: string;
    };
  };
  owner: IOwner;
}

export interface ILink {
  key: string;
  type: 'internal' | 'external';
  name: string;
  uri: string;
  icon?: string;
  style?: string;
}

export { IConfig };