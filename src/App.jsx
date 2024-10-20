import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { getMovieList, searchMovie, getNowPlaying } from './api'
import { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  const [topMovies, setTopMovies] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [searchResults, setSearchResults] = useState([]);

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
              <div className="container">
                <div className="carousel-caption text-start">
                  <h1>{movie.title}</h1>
                  <p>
                    {movie.genres.map(genre => genre.name).join(', ')}
                  </p>
                  <p>
                    <a className="btn btn-lg btn-primary" href="#">More Info</a>
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
        <div className="col-lg-2">
          <div className="card">
            <img
              className="bd-placeholder-img card-img-top" width="100%" preserveAspectRatio="xMidYMid slice" focusable="false"
              src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`} alt="" />
          </div>
        </div>
      )
    })
  }

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q)
      setSearchResults(query.results.slice(0, 18))
      navigate('/search-results');
    }
  }

  const MovieCard = ({ movie }) => {
    return (
      <div className="col-lg-2">
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

  const handleIconClick = () => {
    if (searchQuery.length > 3) {
      search(searchQuery);
    }
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
                <div className="album py-5" id="list">
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

    </div >
  )
}

export default App
