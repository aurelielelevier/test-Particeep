import React from 'react'
import {connect} from 'react-redux';
import { useState, useEffect } from 'react';

import { movies$ } from '../data/movies';
import CardMovie from './CardMovie';

function Movies({setMoviesToRedux, moviesFromRedux}) {
    const [categories, setCategories] = useState([]);
    const [choosenCategories, setChoosenCategories] = useState(true);
    const [moviesToDisplay, setMoviesToDisplay] = useState([])

    useEffect(() => {
        movies$.then(data => {
            const dataList = data.map(movie => {
                return {...movie, like:false}
            })
            setMoviesToRedux(dataList)
        }
        )
      }, []);

    useEffect(() => {
        const searchCAllCategories = moviesFromRedux.map(movie => movie.category)
        setCategories(Array.from(new Set (searchCAllCategories)))
        setMoviesToDisplay(moviesFromRedux)
      }, [moviesFromRedux, choosenCategories])
    
    const toggleLike = () => {

    }
    return (
        <div className="App">
            { choosenCategories &&
            moviesToDisplay.map(movie => {
                return(
                <CardMovie key={movie.id} movie={movie}/>
                )
            })
            }
      </div>
    )
};

function mapDispatchToProps (dispatch) {
    return {
        setMoviesToRedux: function(data){
            dispatch({type:'setMovies', data: data})
        }
    }
};

function mapStateToProps(state) {
    return { moviesFromRedux : state.movies }
};

export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(Movies);
