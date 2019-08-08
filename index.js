const taotieHttp = require('@taotiejs/http');

module.exports = function koaLogger(opts, stream) {
  const wrap = taotieHttp(opts, stream);
  function taotie(ctx, next) {
    wrap(ctx.req, ctx.res);
    ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
    return next().catch((e) => {
      ctx.log.error({
        res: ctx.res,
        err: {
          type: e.constructor.name,
          message: e.message,
          stack: e.stack,
        },
        responseTime: ctx.res.responseTime,
      }, `${ctx.method} ${ctx.originalUrl} ${ctx.res.statusCode}${ctx.res.responseTime ? ` ${ctx.res.responseTime}ms` : ''}`);
      throw e;
    });
  }
  taotie.logger = wrap.logger;
  return taotie;
};
