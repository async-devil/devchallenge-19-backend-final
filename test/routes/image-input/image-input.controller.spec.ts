import fastify from "fastify";

import ImageInputController from "src/routes/image-input/image-input.controller";
import { ImageInputService } from "src/routes/image-input/image-input.service";

describe("ImageInput controller", () => {
	const app = fastify();

	beforeAll(async () => {
		void app.register(ImageInputController, {});
		await app.ready();
	});

	afterAll(() => app.close());

	test("Should return valid value on success", async () => {
		jest
			.spyOn(ImageInputService.prototype, "parseImage")
			.mockResolvedValueOnce([{ x: 0, y: 0, level: 10 }]);

		const result = await app.inject({
			url: "/",
			method: "POST",
			payload: {
				min_level: 8,
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgA",
			},
		});

		expect(JSON.parse(result.payload)).toEqual({ mines: [{ x: 0, y: 0, level: 10 }] });
	});

	test("Status code should be 400 on invalid input data", async () => {
		const result = await app.inject({
			url: "/",
			method: "POST",
			payload: {
				min_level: "It is not a number, I promise",
				image: 44,
			},
		});

		expect(result.statusCode).toBe(400);
	});

	test("Status code should be 422 when service throws 422 error", async () => {
		jest.spyOn(ImageInputService.prototype, "parseImage").mockRejectedValueOnce({
			statusCode: 422,
			error: "Unprocessable Entity",
			details: "Invalid PNG",
		});

		const result = await app.inject({
			url: "/",
			method: "POST",
			payload: {
				min_level: 8,
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgA",
			},
		});

		expect(result.statusCode).toBe(422);
	});
});
