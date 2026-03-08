import { jsx as _jsx } from "react/jsx-runtime";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
export default async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const body = await renderToReadableStream(_jsx(ServerRouter, { context: routerContext, url: request.url }), {
        onError(error) {
            responseStatusCode = 500;
            if (shellRendered) {
                console.error(error);
            }
        },
    });
    shellRendered = true;
    if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
        await body.allReady;
    }
    responseHeaders.set("Content-Type", "text/html");
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}
