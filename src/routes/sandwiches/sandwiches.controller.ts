import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { NotFound } from "http-errors";

import { CreateSandwichBodyDto } from "./dto/create-sandwich.dto";
import { GetSandwichParamsDto } from "./dto/get-sandwich.dto";
import { SandwichDto, SandwichType } from "./dto/sandwich.dto";

export const autoPrefix = "/sandwiches";

const SandwichesController: FastifyPluginAsyncTypebox = async (server) => {
	const sandwiches: SandwichType[] = [];

	server.get(
		"/:id",
		{
			schema: {
				params: GetSandwichParamsDto,
				response: {
					200: SandwichDto,
				},
			},
		},
		(request) => {
			const sandwich = sandwiches.find((sandwich) => sandwich.id === request.params.id);

			if (!sandwich) throw new NotFound();

			return sandwich;
		}
	);

	server.post(
		"/",
		{
			schema: {
				body: CreateSandwichBodyDto,
				response: {
					201: SandwichDto,
				},
			},
		},
		async (request, response) => {
			const sandwich = {
				id: Date.now(),
				name: request.body.name,
				ingredients: request.body.ingredients,
			};

			sandwiches.push(sandwich);

			return await response.code(201).send(sandwich);
		}
	);
};

export default SandwichesController;
