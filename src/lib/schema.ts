import { z } from 'zod';

const imageTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'image/gif'
];

// ------------------------------
// REGISTER USER
// ------------------------------
export const registerUserSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Email must be a valid email' }),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
			}),
		passwordConfirm: z
			.string({ required_error: 'Confirm Password is required' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
				message:
					'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
			})
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['passwordConfirm']
			});
		}
	});

export type RegisterUserSchema = typeof registerUserSchema;

// ------------------------------
// LOGIN USER
// ------------------------------
export const loginUserSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

export type LoginUserSchema = typeof loginUserSchema;

// ------------------------------
// ADD TICKET
// ------------------------------
export const addIncidentSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(2500),
	courseId: z.string().min(15).max(15),
	materialId: z.string().min(15).max(15)
});

export type AddIncidentSchema = typeof addIncidentSchema;

// ------------------------------
// EDIT TICKET AS STUDENT
// ------------------------------
export const editIncidentSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(2500)
});

export type EditIncidentSchema = typeof editIncidentSchema;

// ------------------------------
// EDIT TICKET AS TESACHER
// ------------------------------
export const editIncidentAsTeacherSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(2500),
	courseId: z.string().min(15).max(15),
	assigneeId: z.string().min(15).max(15),
	status: z.string().min(1).max(30)
});

export type EditIncidentAsTeacherSchema = typeof editIncidentAsTeacherSchema;

// ------------------------------
// ADD COMMENT
// ------------------------------
export const addComment = z.object({
	body: z.string().min(1).max(1000),
	isInternal: z.boolean().default(false)
});

export type AddComment = typeof addComment;

// ------------------------------
// UPDATE PASSWORD
// ------------------------------
export const updatePasswordSchema = z
	.object({
		oldPassword: z.string({ required_error: 'Old password is required' }),
		password: z.string({ required_error: 'Password is required' }),
		passwordConfirm: z.string({ required_error: 'Confirm Password is required' })
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password & Confirm password must match',
				path: ['passwordConfirm']
			});
		}
	});

// ------------------------------
// PASSWORD RESET
// ------------------------------
export const resetPasswordSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

// ------------------------------
// UPDATE EMAIL
// ------------------------------
export const updateEmailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email' })
});
export type UpdateEmailSchema = typeof updateEmailSchema;

// ------------------------------
// UPDATE USERNAME
// ------------------------------
export const updateUsernameSchema = z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(24, { message: 'Username must be 24 characters or less' })
		.regex(/^[a-zA-Z0-9]*$/, { message: 'Username can only contain letters or numbers.' })
});
export type UpdateUsernameSchema = typeof updateUsernameSchema;

// ------------------------------
// UPDATE PROFILE
// ------------------------------
export const updateProfileSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, { message: 'Name is required' })
		.max(64, { message: 'Name must be 64 characters or less' })
		.trim(),

	job_title: z
		.string({ required_error: 'Job Title is required' })
		.min(1, { message: 'Job Title is required' })
		.max(64, { message: 'Job Title must be 64 characters or less' })
		.trim(),

	avatar: z
		.instanceof(Blob)
		.optional()
		.superRefine((val, ctx) => {
			if (val) {
				if (val.size > 5242880) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Avatar must be less than 5MB'
					});
				}

				if (!imageTypes.includes(val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Unsupported file type. Supported formats: jpeg, jpg, png, webp, svg, gif'
					});
				}
			}
		})
});
