import type { Handler, HeaderValue, Header } from './application.ts';


export class Route {
  private _path: string | RegExp;
  private _handler: Handler;
  private _headers: Map<string, HeaderValue> = new Map();

  constructor(path: string | RegExp, handler: Handler, options: { headers: Header[]; } = { headers: [] }) {
    this._handler = handler;
    this._path = path;
    this._headers = new Map(options.headers);
  }

  withHeaders(headers: Header[]): this {
    headers.forEach(([header, value]) => this.withHeader(header, value));
    return this;
  }

  withHeader(header: string, value: HeaderValue): this {
    this._headers.set(header, value);
    return this;
  }

  get handler(): Handler {
    return async (request: Request): Promise<Response> => {
      console.debug(`🚀 Handling request for route, '${this._path}'`);
      const response = await this._handler(request);
      for (const [header, value] of this.resolveHeaders()) {
        response.headers.set(header, value);
      }
      return response;
    };
  }

  private resolveHeaders(): [string, string][] {
    const processedHeaders: [string, string][] = [];
    for (const [header, value] of this._headers.entries()) {
      const resolvedValue = typeof value === 'function' ? value() : value;
      if (resolvedValue !== undefined) {
        processedHeaders.push([header, resolvedValue]);
      }
    }
    return processedHeaders;
  }
}
