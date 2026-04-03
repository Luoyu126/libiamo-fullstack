import { error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { templateSchema } from "$lib/schemas";
import { db } from "$lib/server/db";
import { template } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const id = Number(event.params.id);
	if (Number.isNaN(id)) return error(404, "Template not found");

	const [tpl] = await db.select().from(template).where(eq(template.id, id)).limit(1);
	if (!tpl) return error(404, "Template not found");

	return { template: tpl };
};

export const actions: Actions = {
	save: async (event) => {
		const id = Number(event.params.id);
		const formData = await event.request.formData();
		const raw = Object.fromEntries(formData);

		const result = templateSchema.safeParse(raw);
		if (!result.success) {
			return fail(400, { errors: result.error.flatten().fieldErrors, values: raw });
		}

		await db.update(template).set(result.data).where(eq(template.id, id));

		return { saved: true };
	},

	delete: async (event) => {
		const id = Number(event.params.id);
		await db.update(template).set({ isActive: false }).where(eq(template.id, id));
		return redirect(302, "/admin/templates");
	},
};
