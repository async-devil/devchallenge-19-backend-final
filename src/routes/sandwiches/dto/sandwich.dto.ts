import { Static, Type } from "@sinclair/typebox";

export const SandwichDto = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	ingredients: Type.Record(Type.String(), Type.Number()),
});

export type SandwichType = Static<typeof SandwichDto>;
