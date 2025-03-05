import express from "express";
import movies from "./movies.json";
import { validateMovie, validatePatialMovie } from "./schemas/movies";

const app = express();
app.delete("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hola chancay");
});

const ACCEPTED_ORIGINS = [
	"http://localhost:8080",
	"http://localhost:3000",
	"http://movies.com",
	"http://midu.dev",
];

// Todos los recursos que sean Movies se indentifican con /movies;
app.get("/movies", (req, res) => {
	const origin = req.header("origin") as string;
	if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
		res.header("Access-Control-Allow-Origin", origin);
	}

	const { genre } = req.query;

	if (genre) {
		const genreLowerCase = (genre as string).toLowerCase();

		const filteredMovies = movies.filter((movie) =>
			movie.genre.some((g) => g.toLowerCase() === genreLowerCase),
		);

		res.json(filteredMovies);
	}

	res.json(movies);
});

app.post("/movies", (req, res) => {
	const result = validateMovie(req.body);

	if (result.error) {
		res.status(400).json({ error: result.error.message });
	}

	const newMovie = {
		id: crypto.randomUUID(),
		...result.data,
	};

	movies.push(newMovie);

	res.status(201).json(newMovie);
});

app.get("/movies/:id", (req, res) => {
	const { id } = req.params;

	const movie = movies.find((movie) => movie.id === id);

	if (movie) {
		res.json(movie);
	} else {
		res.status(404).json({ message: "Movie  not found" });
	}
});

app.patch("/movies/:id", (req, res) => {
	const result = validatePatialMovie(req.body);

	if (!result.success) {
		res.status(404).json({ error: JSON.parse(result.error.message) });
	}

	const { id } = req.params;
	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) {
		res.status(404).json({ message: "Movie not found" });
	}

	const updateMovie = {
		...movies[movieIndex],
		...result.data,
	};

	movies[movieIndex] = updateMovie;

	res.json(updateMovie);
});

app.delete("/movies/:id", (req, res) => {
	const { id } = req.params;
	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) {
		res.status(404).json({ message: "Movie not found" });
	}

	movies.splice(movieIndex, 1);

	res.json({ message: "movie deleted" });
});

const PORT = Bun.env.PORT ?? 1234;

app.listen(PORT, () => {
	console.log(`Servidor escuchand en http://localhost:${PORT}`);
});
