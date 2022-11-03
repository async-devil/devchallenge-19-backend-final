import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { ImageInputBodyDto, ImageInputResponseDto } from "./dto/image-input.dto";
import { ImageInputService } from "./image-input.service";

export const autoPrefix = "/image-input";

const ImageInputController: FastifyPluginAsyncTypebox = async (server) => {
	server.post(
		"/",
		{
			schema: {
				body: ImageInputBodyDto,
				response: {
					200: ImageInputResponseDto,
				},
			},
		},
		async (request) => {
			const imageInputService = new ImageInputService(request.body.image, request.body.min_level);

			const mines = await imageInputService.parseImage();

			return { mines };
		}
	);
};

export default ImageInputController;
