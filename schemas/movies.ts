import z from "zod";

const movieSchema = z.object({
	title: z.string({
		invalid_type_error: "Movie title must be a string",
		required_error: "Movie title is requied",
	}),
	year: z.number().int().min(1900).max(2024),
	director: z.string(),
	duration: z.number().int().positive(),
	rate: z.number().min(0).max(10).default(0),
	poster: z.string().url({
		message: "Poster must be a valid URL",
	}),
	genre: z.array(
		z.enum([
			"Action",
			"Adventure",
			"comedy",
			"Drama",
			"Fantasy",
			"Horror",
			"Thriller",
			"Sci-Fi",
		]),
		{
			required_error: "Movie genre is required.",
			invalid_type_error: "Moviegenre must be an array of enum Genre",
		},
	),
});

export function validateMovie(input: object) {
	return movieSchema.safeParse(input);
}

export function validatePatialMovie(input: object) {
	return movieSchema.partial().safeParse(input);
}
