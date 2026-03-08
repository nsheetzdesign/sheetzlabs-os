import type { AppLoadContext, EntryContext } from "react-router";
export default function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, routerContext: EntryContext, _loadContext: AppLoadContext): Promise<Response>;
