import { fail, redirect } from "@sveltejs/kit";
import { templateSchema } from "$lib/schemas";
import { db } from "$lib/server/db";
import { template } from "$lib/server/db/schema";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const raw = Object.fromEntries(formData);

		const result = templateSchema.safeParse(raw);
		if (!result.success) {
			return fail(400, { errors: result.error.flatten().fieldErrors, values: raw });
		}

		const userId = event.locals.user?.id;
		if (!userId) return fail(401);

		await db.insert(template).values({
			...result.data,
			createdBy: userId,
		});

		return redirect(302, "/admin/templates");
	},
};
