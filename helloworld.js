/*
Koa 中间件以更传统的方式级联，您可能习惯使用类似的工具 - 之前难以让用户友好地使用 node 的回调。然而，使用 async 功能，我们可以实现 “真实” 的中间件。对比 Connect 的实现，通过一系列功能直接传递控制，直到一个返回，Koa 调用“下游”，然后控制流回“上游”。

下面以 “Hello World” 的响应作为示例，当请求开始时首先请求流通过 x-response-time 和 logging 中间件，然后继续移交控制给 response 中间件。当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。

*/

const Koa = require('koa');
const app = new Koa();

console.log('app.env',app.env);

//logger
app.use(async (ctx,next) => {
	await next();
	const rt = ctx.response.get('x-response-time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

//x-response-time
app.use(async(ctx,next)=>{
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('x-response-time',`${ms}ms`);
});

//response
app.use(async ctx => {
	console.log('ctx',ctx);
	ctx.body = 'Hello World';
});

app.listen(3000);







