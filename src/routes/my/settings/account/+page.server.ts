/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateEmailSchema } from '$lib/schema';
import { validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}
};

export const actions = {
	updateEmail: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updateEmailSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('users').requestEmailChange(formData.email);
		} catch (err: any) {
			throw error(err.status, err.message);
		}

		return {
			success: true
		};
	}
};
