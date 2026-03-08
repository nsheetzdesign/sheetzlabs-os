declare module "react-router" {
    interface AppLoadContext {
        cloudflare: {
            env: Env;
            ctx: ExecutionContext;
        };
    }
}
declare const _default: {
    fetch(request: Request<unknown, IncomingRequestCfProperties<unknown>>, env: Env, ctx: ExecutionContext<unknown>): Promise<Response>;
};
export default _default;
