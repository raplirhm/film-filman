import axios from "axios";

const baseUrl = import.meta.env.VITE_BASEURL;
const apiKey = import.meta.env.VITE_APIKEY;

export const getMovieList = async () => {
    const movie = await axios.get(`${baseUrl}/movie/top_rated?api_key=${apiKey}`);
    console.log({ movieList: movie });
    return movie.data.results
}

export const searchMovie = async (q) => {
    const search = await axios.get(`${baseUrl}/search/movie?query=${q}&api_key=${apiKey}`)
    return search.data
}

export const getNowPlaying = async () => {
    const movie = await axios.get(`${baseUrl}/movie/now_playing?api_key=${apiKey}`);
    console.log({ nowplaying: movie });

    const nowPlayingMovies = movie.data.results;

    // For each movie, fetch additional details including the genre
    const moviesWithGenres = await Promise.all(
        nowPlayingMovies.map(async (movie) => {
            const movieDetails = await axios.get(`${baseUrl}/movie/${movie.id}?api_key=${apiKey}`);
            return { ...movie, genres: movieDetails.data.genres };
        })
    );

    console.log({ nowPlayingWithGenres: moviesWithGenres });
    return moviesWithGenres; // Return the movies with genres
}