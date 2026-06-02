// Supabase configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// App configuration
export const APP_CONFIG = {
	name: "Together Habit Tracking",
	version: "1.0.0",
	description: "A minimalist iOS habit tracking app for couples",
};

// Environment
export const ENVIRONMENT = {
	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production",
	isTest: process.env.NODE_ENV === "test",
};
