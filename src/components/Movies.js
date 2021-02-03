import React from 'react'
import {connect} from 'react-redux';
import { useState, useEffect  } from 'react';

import { movies$ } from '../data/movies';
import CardMovie from './CardMovie';

import {Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

function Movies({setMoviesToRedux, moviesFromRedux}) {
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState('All');
    const [allMoviesToDisplay, setAllMoviesToDisplay] = useState([]);
    const [moviesToDisplay, setMoviesToDisplay] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOnPage, setNumberOnPage] = useState(4);
    const [active, setActive] = useState(1);
    const [arrayNumbers, setArrayNumbers] = useState([])

    useEffect(() => {
        // Find the data from the file & send it to Redux
        movies$.then(data => {
            const dataList = data.map(movie => {
                return {...movie, like:false}
            })
            setMoviesToRedux(dataList)
        })
      }, []);

    useEffect(() => {
        // Set an array whith all categories of movies and delete duplicates
        const searchCAllCategories = moviesFromRedux.map(movie => movie.category)
        setCategories(Array.from(new Set (searchCAllCategories)))
        setAllMoviesToDisplay(moviesFromRedux)
        // Calculate number of pages to display with all the movies in Redux
        setNumberOfPages(moviesFromRedux.length%numberOnPage === 0 ? moviesFromRedux.length/numberOnPage : moviesFromRedux.length/numberOnPage + 1)
    }, [moviesFromRedux])

    useEffect(() => {
        // set the list of movies to display by page
        let toDisplay = [...allMoviesToDisplay]
        let indexStart = numberOnPage * active - numberOnPage
        let indexEnd = numberOnPage * active
        let result = toDisplay.slice(indexStart, indexEnd)
        setMoviesToDisplay(result)
        setNumberOfPages(allMoviesToDisplay.length%numberOnPage === 0 ? allMoviesToDisplay.length/numberOnPage : allMoviesToDisplay.length/numberOnPage + 1)
    }, [allMoviesToDisplay, numberOnPage, active])
    
    useEffect(() => {
        // set the list of movies by category selected 
        if (categorySelected === 'All'){
            setAllMoviesToDisplay(moviesFromRedux)
        } else {
            const moviesSelected = moviesFromRedux.filter(movie => movie.category === categorySelected)
            setAllMoviesToDisplay(moviesSelected)
        }
        setActive(1)
    }, [categorySelected])

    useEffect(() => {
        // set an array of pages's numbers in order to map on it
        let array = []
        for (let number = 1; number <= numberOfPages; number++) {
            array.push(number)
        }
        setArrayNumbers(array)
    }, [numberOfPages])

       
    return (
        <div className="App">
            <div className='header'>
                <h4 style={{color:'grey', marginBottom:20}}> Choisissez votre catégorie préférée :</h4>
                <Form style={{ marginBottom:20}}>
                    <Form.Group controlId="categories" >
                        <Form.Control as="select"  
                            style={{minWidth:'30%'}}
                            onChange={(item)=> setCategorySelected(item.target.value)}>
                            <option>All</option>
                            {
                                categories.map(category => {
                                    return (
                                        <option key={category} style={{color:'red'}}>{category}</option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <div style={{width:'100%', display:'flex'}}>
                <div className='row_pagination'>
                    {/* hide the previous icon if the first page is displaying  */}
                    {active !== arrayNumbers[0] && 
                    <FontAwesomeIcon 
                        icon={faAngleDoubleLeft} 
                        onClick={()=> 
                            setActive(active-1)
                        }
                        color='white'
                        style={{cursor:'pointer'}}
                    />}
                    {arrayNumbers.map(number => {
                        return (
                            <div 
                                key={number} 
                                className='pagination_button'
                                style={{cursor:'pointer', backgroundColor: active === number && '#696969'}}
                                onClick={()=> setActive(number)}
                            >
                            {number}
                            </div>
                        )
                    })}
                    {/* hide the next icon if the last page is displaying  */}
                    {active !== arrayNumbers[arrayNumbers.length-1] && 
                        <FontAwesomeIcon 
                            icon={faAngleDoubleRight} 
                            onClick={()=> 
                                setActive(active+1)
                            }
                            color='white'
                            style={{cursor:'pointer'}}
                        />
                    }

                    <p style={{fontSize:10, marginLeft:10, marginRight:10}}>Résultats par page :</p>
                    <Form >
                        <Form.Group controlId="resultats" >
                            <Form.Control as="select"  
                                style={{minWidth:'30%'}}
                                onChange={(item)=> setNumberOnPage(item.target.value)}>
                                <option>4</option>
                                <option>8</option>
                                <option>12</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
                
            </div>
            <div className='movies_row'>
                { 
                    moviesToDisplay.map(movie => {
                        return(
                            <CardMovie key={movie.id} movie={movie}/>
                        )
                    })
                }
            </div>
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
