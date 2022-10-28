import { join } from "path";

import autoLoad from "@fastify/autoload";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify, { RouteOptions } from "fastify";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

const routes: RouteOptions[] = [];

void server.register(autoLoad, {
	dir: join(__dirname, "routes"),
	dirNameRoutePrefix: false,
	options: { prefix: "/api" },
});

server.addHook("onRoute", (route) => {
	routes.push(route);
});

function printRoute(route: RouteOptions) {
	console.log(`Route ${route.method.toString()} ${route.url} initialized`);
}

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server is listening at ${address}\n`);

	for (const route of routes) printRoute(route);
});
