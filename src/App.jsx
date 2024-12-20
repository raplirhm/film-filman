import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { getMovieList, searchMovie, getNowPlaying, getMovieDetails, getPopularMovies, getUpcomingMovies } from './api'
import { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { FaStar } from "react-icons/fa6";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  const [topMovies, setTopMovies] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null); // To store movie details
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getMovieList().then((result) => {
      setTopMovies(result.slice(0, 18));
    })
  }, [])

  useEffect(() => {
    getNowPlaying().then((result) => {
      setNowPlaying(result.slice(0, 5));
    })
  }, [])

  const fetchMovieDetails = async (movie_id) => {
    const details = await getMovieDetails(movie_id);
    setMovieDetails(details); // Store movie details in state
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setIsClosing(true); // Set closing state
    setTimeout(() => {
      setShowModal(false); // Hide the modal after animation
      setIsClosing(false); // Reset closing state
      setMovieDetails(null); // Clear movie details
    }, 300); // Match the duration with CSS animation
  };

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60); // Get the whole hours
    const minutes = runtime % 60; // Get the remaining minutes
    return `${hours} h ${minutes} m`;
  };


  const NowPlaying = () => {
    return (
      <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {nowPlaying.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              data-bs-target="#myCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {nowPlaying.map((movie, index) => (
            <div
              key={movie.id}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,1)), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh'
              }}
            >
              <div className="container-carousel">
                <div className="carousel-caption text-start">
                  <h1>{movie.title}</h1>
                  <p>
                    {movie.genres.map(genre => genre.name).join(', ')}
                  </p>
                  <p>
                    <button className="info btn btn-lg btn-primary" onClick={() => { fetchMovieDetails(movie.id) }}>More Info</button>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  }

  const TopMovieList = () => {
    return topMovies.map((movie, i) => {
      return (
        <div className="col-lg-2" key={movie.id}>
          <div className="card">
            <img
              className="bd-placeholder-img card-img-top"
              width="100%"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`}
              alt={movie.title}
              onClick={() => fetchMovieDetails(movie.id)} // Add this line
              style={{ cursor: 'pointer' }} // Optional: To show it's clickable
            />
          </div>
        </div>
      );
    });
  };


  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q)
      setSearchResults(query.results.slice(0, 18))
      navigate('/search-results');
    }
  }

  const MovieCard = ({ movie }) => {
    return (
      <div className="col-lg-2" onClick={() => fetchMovieDetails(movie.id)}>
        <div className="card">
          <img
            className="bd-placeholder-img card-img-top"
            width="100%"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
      </div>
    );
  };

  const SearchResults = () => {
    return (
      <div className="album py-5 search-results" id="search-list">
        <div className="container">
          <h4 className='container-title'>Search Results</h4>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {searchResults.length > 0 ? (
              searchResults.map((movie, i) => (
                <MovieCard key={i} movie={movie} />
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;
      if (query.length > 3) {
        search(query);
      }
    }
  };

  const PopularMovies = () => {
    const [popularMovies, setPopularMovies] = useState([]);

    useEffect(() => {
      // Fetch popular movies from your API
      getPopularMovies().then((result) => {
        setPopularMovies(result.slice(0, 18)); // Fetch the first 12 popular movies
      });
    }, []);

    const moviesPerSlide = 6; // Number of movies per slide

    // Function to split movies into chunks for each slide
    const chunkMovies = (movies, size) => {
      const chunks = [];
      for (let i = 0; i < movies.length; i += size) {
        chunks.push(movies.slice(i, i + size));
      }
      return chunks;
    };

    const movieChunks = chunkMovies(popularMovies, moviesPerSlide);

    return (
      <div className='container-multi'>
        <div id="multiItemCarousel" className="carousel slide multi" data-bs-ride="carousel">
          <div className="carousel-inner">
            {movieChunks.map((chunk, slideIndex) => (
              <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`}>
                <div className="row multi-row">
                  {chunk.map((movie) => (
                    <div className="col-lg-2 multi-card" key={movie.id}>
                      <div className="card">
                        <img
                          className="bd-placeholder-img card-img-top"
                          width="100%"
                          src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`}
                          alt={movie.title}
                          onClick={() => fetchMovieDetails(movie.id)}
                          style={{
                            cursor: 'pointer',
                            width: '202.66px', // Same width as in TopMovieList
                            height: '300px', // Adjust height to match TopMovieList
                            objectFit: 'cover', // Ensure images are scaled properly
                            padding: '0px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='prevnext'>
            <button className="carousel-control-prev prev" type="button" data-bs-target="#multiItemCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next next" type="button" data-bs-target="#multiItemCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

        </div>
      </div>
    );
  };

  const UpcomingMovies = () => {
    const [upcomingMovies, setUpcomingMovies] = useState([]);

    useEffect(() => {
      // Fetch popular movies from your API
      getUpcomingMovies().then((result) => {
        setUpcomingMovies(result.slice(0, 18)); // Fetch the first 12 popular movies
      });
    }, []);

    const moviesPerSlide = 6; // Number of movies per slide

    // Function to split movies into chunks for each slide
    const chunkMovies = (movies, size) => {
      const chunks = [];
      for (let i = 0; i < movies.length; i += size) {
        chunks.push(movies.slice(i, i + size));
      }
      return chunks;
    };

    const movieChunks = chunkMovies(upcomingMovies, moviesPerSlide);

    return (
      <div className='container-multi'>
        <div id="multiItemCarousel2" className="carousel slide multi" data-bs-ride="carousel">
          <div className="carousel-inner">
            {movieChunks.map((chunk, slideIndex) => (
              <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? 'active' : ''} upcoming`}>
                <div className="row multi-row">
                  {chunk.map((movie) => (
                    <div className="col-lg-2 multi-card" key={movie.id}>
                      <div className="card">
                        <img
                          className="bd-placeholder-img card-img-top"
                          width="100%"
                          src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`}
                          alt={movie.title}
                          onClick={() => fetchMovieDetails(movie.id)}
                          style={{
                            cursor: 'pointer',
                            width: '202.66px', // Same width as in TopMovieList
                            height: '300px', // Adjust height to match TopMovieList
                            objectFit: 'cover', // Ensure images are scaled properly
                            padding: '0px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='prevnext'>
            <button className="carousel-control-prev prev" type="button" data-bs-target="#multiItemCarousel2" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next next" type="button" data-bs-target="#multiItemCarousel2" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

        </div>
      </div>
    );
  };


  return (
    <div>
      <header>
        <div className="navbar navbar-dark bg-transparent navbar-gradient">
          <div className="container container-navbar">
            <a href="#" className="navbar-brand d-flex align-items-center">
              <strong>Kino</strong>
            </a>
            <span>
              <input
                type="text"
                placeholder="Search..."
                onKeyDown={handleKeyPress}
              />
              <i><FaSearch /></i>
            </span>
          </div>
        </div>
      </header >

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NowPlaying />
                <div className='container'>
                  <h4 className='container-title'>Trending</h4>
                  <PopularMovies />
                </div>
                <div className='container'>
                  <h4 className='container-title'>Upcoming</h4>
                  <UpcomingMovies />
                </div>
                <div className="album" id="list">
                  <div className="container">
                    <h4 className='container-title'>Top Rated</h4>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                      <TopMovieList />
                    </div>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </main>

      <footer className="text-body-secondary py-5">
        <div className="container">
          <p className="mb-1 text-center">&copy; raplirhm</p>
        </div>
      </footer>
      <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

      {movieDetails && (
        <div className={`modal fade ${showModal ? 'show d-block' : ''} ${isClosing ? 'slide-out' : ''}`} tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',

          }}
          onClick={closeModal}
        >
          <div className="modal-dialog modal-lg shadow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className='modal-head'>
                <div className="modal-title">
                  <h1 className="modal-title">{movieDetails.title}</h1>
                  <span className='date-runtime'>
                    <p>{movieDetails.release_date}</p>
                    <LuDot />
                    <p>{formatRuntime(movieDetails.runtime)}</p>
                  </span>
                </div>
                <div className='modal-sub'>
                  <FaStar />
                  <h4 className='mb-0'>{movieDetails.vote_average.toFixed(1)}</h4>
                  <p className='mb-0'>/10</p>
                </div>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-3">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                      alt={movieDetails.title}
                      className="img-fluid"
                      style={{
                        width: '250px',
                        height: '300px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className="col-lg-9">
                    <div
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '300px',
                        marginTop: '0px',
                        width: '100%',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-8 modal-detail">
                  <p>{movieDetails.genres.map(genre => genre.name).join(', ')}</p>
                  <p>{movieDetails.overview}</p>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

    </div >
  )
}

export default App
