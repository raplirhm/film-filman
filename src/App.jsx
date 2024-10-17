import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMovieList, searchMovie } from './api'
import { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";




function App() {
  const [popularMovies, setPopularMovies] = useState([])

  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result)
    })
  }, [])

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => {
      return (
        <div className="col">
          <div className="card shadow-sm">
            <img
              className="bd-placeholder-img card-img-top" width="100%" preserveAspectRatio="xMidYMid slice" focusable="false"
              src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`} alt="" />
            <div className="card-body">
              <h4>{movie.title}</h4>
              <span>
                <p>{movie.release_date}</p><p>{movie.vote_average}</p>
              </span>
              <div className="d-flex justify-content-between align-items-center">
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q)
      setPopularMovies(query.results)
    }
  }

  return (
    <div>
      <header data-bs-theme="dark">
        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container container-navbar">
            <a href="#" className="navbar-brand d-flex align-items-center">
              <strong>Kino</strong>
            </a>
            <span>
            <input type="text" placeholder="Search.." onChange={({ target }) => search(target.value)} />
            <i><FaSearch /></i>
            </span>
          </div>
        </div>
      </header >

      <main>
        <section className="py-5 text-center container">
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
              <h1>Welcome to Kino</h1>
              <p className="lead text-body-secondary">Discover your favorite movies with ease. Stream anytime, anywhere!</p>
              <p>
                <a href="#list" className="btn btn-primary my-2">Film List</a>
              </p>
            </div>
          </div>
        </section>

        <div className="album py-5 bg-body-tertiary" id='list'>
          <div className="container" >
            <h4>Film List</h4>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <PopularMovieList />
            </div>
          </div>
        </div>

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
