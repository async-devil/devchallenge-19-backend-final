/* eslint-disable no-useless-escape */
import { Type } from "@sinclair/typebox";

export const ImageInputBodyDto = Type.Object({
	min_level: Type.Number({ minimum: 0, maximum: 100 }),
	image: Type.String(),
});

export type Mine = {
	x: number;
	y: number;
	level: number;
};

export const ImageInputResponseDto = Type.Object({
	mines: Type.Array(
		Type.Object({
			x: Type.Number({ minimum: 0 }),
			y: Type.Number({ minimum: 0 }),
			level: Type.Number({ minimum: 0, maximum: 100 }),
		})
	),
});
