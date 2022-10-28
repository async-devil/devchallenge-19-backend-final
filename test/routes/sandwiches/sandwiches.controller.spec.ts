import fastify from "fastify";

import SandwichesController from "src/routes/sandwiches/sandwiches.controller";

describe("Sandwiches controller", () => {
	const app = fastify();

	beforeAll(async () => {
		void app.register(SandwichesController, {});
		await app.ready();
	});

	afterAll(() => app.close());

	describe("Get sandwich route", () => {
		test("Should return valid sandwich if exists", async () => {
			jest
				.spyOn(Array.prototype, "find")
				.mockReturnValueOnce({ id: 12345, name: "Meat sandwich", ingredients: {} });

			const result = await app.inject({
				url: "/12345",
			});

			expect(JSON.parse(result.payload)).toHaveProperty("id", 12345);
		});

		test("Should return 404 on nonexisting sandwich", async () => {
			const result = await app.inject({
				url: "/12345",
			});

			expect(JSON.parse(result.payload)).toHaveProperty("statusCode", 404);
		});

		test("Should return 400 on invalid sandwich id", async () => {
			const result = await app.inject({ url: "/notId" });

			expect(JSON.parse(result.payload)).toHaveProperty("statusCode", 400);
		});
	});

	describe("Create sandwich route", () => {
		test("Should return valid sandwich on valid data", async () => {
			const result = await app.inject({
				method: "POST",
				url: "/",
				payload: {
					name: "Cheese sandwich",
					ingredients: { bread: 2, cheese: 1 },
				},
			});

			expect(JSON.parse(result.payload)).toHaveProperty("id", expect.any(Number));
		});

		test("Should return 400 on invalid sandwich data", async () => {
			const result = await app.inject({
				method: "POST",
				url: "/",
				payload: {
					name: [],
					ingredients: "cheese",
				},
			});

			expect(JSON.parse(result.payload)).toHaveProperty("statusCode", 400);
		});
	});
});
