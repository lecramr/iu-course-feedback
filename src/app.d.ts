// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
		}

		interface User {
			id: string;
			username: string;
		}

		declare module '*.png?enhanced' {
			const value: string;
			export default value;
		}

		declare module '*.jpg?enhanced' {
			const value: string;
			export default value;
		}

		declare module '*.jpeg?enhanced' {
			const value: string;
			export default value;
		}

		declare module '*.webp?enhanced' {
			const value: string;
			export default value;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
