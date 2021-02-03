import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp, faThumbsDown, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

function CardMovie({movie, moviesFromRedux, updateMoviesRedux}) {
    const [url, setUrl] = useState('')
    
    useEffect(() => {
        const query = movie.title.replaceAll(' ', '+')
        const fechData = async () => { 
            const search = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=71b94f30b0afd7b23c94ff3d409f24bf&query=${query}`)
            const data = await search.json()
            setUrl(`https://image.tmdb.org/t/p/original${data.results[0].backdrop_path}`)
        }
        fechData()
   }, [movie])

    const toggleLike = () => {
        let updatedMovie = movie 
        updatedMovie.like = !movie.like
        let index = moviesFromRedux.indexOf(movie)
        let newList = [...moviesFromRedux]
        newList.splice(index, 1, updatedMovie)
        console.log(newList)
        updateMoviesRedux(newList)
    }

    const deleteMovie = () => {
        let newList = moviesFromRedux.filter(item => item.id !== movie.id)
        console.log(newList)
        updateMoviesRedux(newList)
    }
    
    return (
        <div key={movie.id} className='card'>
            <div className='card_image' style={{backgroundImage: `url("${url}")`}}>
                <div className='card_circle_heart'>
                    <FontAwesomeIcon 
                        icon={faHeart} 
                        onClick={()=> 
                            toggleLike()
                        }
                        color={movie.like ? 'red' : 'grey' }
                        size="lg"
                        style={{cursor:'pointer'}}
                    />
                </div>
            </div>
            
            <h3 className='card_title'>{movie.title}</h3>
            <div style={{display:'flex', marginBottom:10, alignItems:'start'}}>
                <div className='card_badge'>{movie.category}</div>
                <div className='card_badge'>
                    <FontAwesomeIcon 
                        icon={faThumbsUp} 
                        color='lightgray'
                        style={{marginRight:5}}
                    /> 
                    {movie.likes}
                
                    <FontAwesomeIcon 
                        icon={faThumbsDown} 
                        color='lightgray'
                        style={{marginLeft: 10, marginRight:5}}
                    /> 
                    {movie.dislikes}
                    
                </div>

            </div>
            <div className='delete_row'>
                <FontAwesomeIcon 
                    icon={faTrash} 
                    color='#181818'
                    onClick={()=> deleteMovie()}
                />    
            </div>
              
        </div>
    )
}
function mapDispatchToProps (dispatch) {
    return {
        updateMoviesRedux: function(data){
            dispatch({type:'updateMovies', newList: data})
        }
    }
};

function mapStateToProps(state) {
    return { moviesFromRedux : state.movies }
};

export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CardMovie)
