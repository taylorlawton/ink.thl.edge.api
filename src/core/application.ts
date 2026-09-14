import { createContainer, Lifetime, type Constructor, type IContainer, type Token } from 'fast-injection';
import { net } from '@bunny.net/edgescript-sdk';
import { Route } from './route.ts';
import { Logger } from './logger.ts';

export type Handler = net.http.ServerHandler;

export type Header = [string, HeaderValue];
export type HeaderValue = string | (() => string | undefined);

type WithServiceOverload = {
  <T>(service: Constructor<T>, life?: Lifetime): ApplicationBuilder;
  <T>(token: Token<T>, service: Constructor<T>, life: Lifetime): ApplicationBuilder;
};

export class Application {
  private container: IContainer;
  private defaultLifetime: Lifetime;
  private routes: Map<string | RegExp, Route> = new Map();
  private responseHeaders: Map<string, HeaderValue> = new Map();
  private _logger: Logger = new Logger(process.stdout, process.stderr);

  constructor(builder: ApplicationBuilder = new ApplicationBuilder()) {
    this.container = builder['container'];
    this.responseHeaders = builder['responseHeaders'];
    this.defaultLifetime = Lifetime.Singleton;
  }

  register<T>(token: Token<T>, provider: () => T, lifetime: Lifetime = this.defaultLifetime): void {
    this.container.register(token, provider, { lifetime });
  }

  resolve<T>(token: Token<T>): T {
    return this.container.resolve(token);
  }

  route(route: string | RegExp, handler: Handler): Route {
    const _route = new Route(route, handler, { headers: Array.from(this.responseHeaders.entries()) });
    this.routes.set(route, _route);

    return _route;
  }

  serve = async (options?: { hostname: string; port: number }): Promise<Handler> => {
    const listener = net.tcp.unstable_new();

    if (listener.addr._tag === 'SocketAddrV4') {
      if (options) {
        const ip = net.ip.tryParseFromString(options.hostname);
        if (!ip || ip instanceof SyntaxError) {
          throw ip;
        }

        listener.addr.ip = ip;
        listener.addr.port = options.port;
      }

      console.debug(`✨ Server is running on http://${net.ip.toString(listener.addr.ip)}:${listener.addr.port}`);
      const handler = await Promise.resolve(this.handle.bind(this));

      net.http.serve(listener, handler);

      return handler;
    } else {
      throw new Error('🤨 Not sure how you got here, but only IPv4 addresses are supported.');
    }
  };

  handle(request: Request): Response | Promise<Response> {
    const path = new URL(request.url).pathname;

    const routeKey = Array.from(this.routes.keys()).find((route) => {
      if ((typeof route === 'string' && path === route) || (route instanceof RegExp && route.test(path))) {
        return true;
      }
      return false;
    });

    const route = this.routes.get(routeKey ?? '');

    if (!route) {
      return this.notFound();
    }

    console.debug(`🎉 Found matching route for '${routeKey}'`);

    return route.handler(request);
  }

  private notFound(): Response {
    return new Response(undefined, { status: 404, statusText: 'Not Found' });
  }
}

export class ApplicationBuilder {
  private container: IContainer;
  private defaultLifetime: Lifetime;
  private responseHeaders: Map<string, HeaderValue> = new Map();

  constructor() {
    this.container = createContainer();
    this.defaultLifetime = Lifetime.Singleton;
  }

  withDefaultLifetime = (lifetime: Lifetime): this => {
    this.defaultLifetime = lifetime;
    return this;
  }

  
  withService: WithServiceOverload = <T>(tokenOrService: Token<T> | Constructor<T>, serviceOrOptions?: Constructor<T> | Lifetime, life?: Lifetime): this => {
    let token: Token<T>;
    let target: Constructor<T>;
    let lifetime: Lifetime;
    
     if (typeof serviceOrOptions === "undefined") {
      token = tokenOrService as Constructor<T>;
      target = tokenOrService as Constructor<T>;
      lifetime = this.defaultLifetime;
    } else if (typeof serviceOrOptions === "function") {
      token = tokenOrService;
      target = serviceOrOptions as Constructor<T>;
      lifetime = life ?? this.defaultLifetime;
    } else {
      token = tokenOrService as Constructor<T>;
      target = tokenOrService as Constructor<T>;
      lifetime = life ?? this.defaultLifetime;
    }

    this.container.register(token, target, { lifetime });
    
    return this;
  }

  withToken = <T>(token: Token<T>, provider: Constructor<T>, lifetime: Lifetime = this.defaultLifetime): this => {
    this.container.register(token, provider, { lifetime });
    return this;
  }

  withFactory = <T>(token: Token<T>, factory: () => T, lifetime: Lifetime = this.defaultLifetime): this => {
    this.container.register(token, factory, { lifetime });
    return this;
  }

  withValue = <T>(token: Token<T>, value: T): this => {
    this.container.register(token, () => value, { lifetime: Lifetime.Singleton });
    return this;
  }

  withHeaders = (headers: [string, HeaderValue][]): this => {
    headers.forEach(([header, value]) => this.withHeader(header, value));
    return this;
  }
  withHeader = (header: string, value: HeaderValue): this => {
    this.responseHeaders.set(header, value);
    return this;
  }

  build = (): Application => {
    return new Application(this);
  }
}
