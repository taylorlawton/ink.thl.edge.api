import { singleton } from 'fast-injection/decorators';
import 'reflect-metadata';

export interface ICacheItem<T> {
  key: string;
  value: T;
  expiresAt: Date;
  expired(): boolean;
}

const ICache = Symbol('ICache');
interface ICache {
  get<T>(key: string): ICacheItem<T> | undefined;
  set<T>(key: string, value: T, ttl?: number): void;
  getOrSet<T>(key: string, valueFactory: () => Promise<T>, ttl?: number): Promise<ICacheItem<T>>;
  delete(key: string): void;
  clear(): void;
}

export interface ICacheOptions {
  defaultTtl?: number;
}

class CacheItem<T> implements ICacheItem<T> {
  key: string;
  value: T;
  expiresAt: Date;

  constructor(key: string, value: T, expiresAt: Date) {
    this.key = key;
    this.value = value;
    this.expiresAt = expiresAt;
  }

  expired = (): boolean => {
    return this.expiresAt.getTime() <= Date.now();
  }
}

@singleton()
class Cache implements ICache{
  private _cacheDefaultTtl: number = 1000 * 60 * 60;

  private _cache: Map<string, ICacheItem<unknown>> = new Map();

  // constructor({ defaultTtl }: ICacheOptions = {}) {
  //   if (defaultTtl !== undefined) {
  //     this._cacheDefaultTtl = defaultTtl;
  //   }
  // }

  get = <T>(key: string): ICacheItem<T> | undefined => {
    const item = this._cache.get(key) as ICacheItem<T> | undefined;
    if (item && item.expired()) {
      this.delete(key);
      return undefined;
    }
    return item;
  }

  set = <T>(key: string, value: T, ttl?: number): void => {
    const expiresAt = new Date(Date.now() + (ttl ?? this._cacheDefaultTtl));
    const cacheItem: ICacheItem<T> = new CacheItem(key, value, expiresAt);
    this._cache.set(key, cacheItem);
  }

  getOrSet = async <T>(key: string, valueFactory: () => Promise<T>, ttl?: number): Promise<ICacheItem<T>> => {
    const existingItem = this.get<T>(key);
    if (existingItem) {
      return existingItem;
    }

    const value = await valueFactory();
    this.set(key, value, ttl);
    return this.get<T>(key) as ICacheItem<T>;
  }

  delete = (key: string): void => {
    this._cache.delete(key);
  }

  clear = (): void => {
    this._cache.clear();
  }

  static key = (key: string[]) => `${key.join(':')}`;
}

export { ICache, Cache };