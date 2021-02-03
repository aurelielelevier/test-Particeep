import React from 'react'
import {connect} from 'react-redux';
import { useState, useEffect  } from 'react';

import { movies$ } from '../data/movies';
import CardMovie from './CardMovie';

import {Form} from 'react-bootstrap';

function Movies({setMoviesToRedux, moviesFromRedux}) {
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);
    const [allMoviesToDisplay, setAllMoviesToDisplay] = useState([]);
    const [moviesToDisplay, setMoviesToDisplay] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOnPage, setNumberOnPage] = useState(4);
    const [active, setActive] = useState(1);

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
        setAllMoviesToDisplay(moviesFromRedux)
        setNumberOfPages(moviesFromRedux.length%numberOnPage === 0 ? moviesFromRedux.length/numberOnPage : moviesFromRedux.length/numberOnPage + 1)
      }, [moviesFromRedux])

    useEffect(() => {
        let toDisplay = [...allMoviesToDisplay]
        toDisplay.splice(numberOnPage * active -1, numberOnPage)
        setMoviesToDisplay(toDisplay)
    }, [allMoviesToDisplay, numberOnPage, active])
    
    useEffect(() => {
        if (categorySelected === 'All'){
            setAllMoviesToDisplay(moviesFromRedux)
        } else {
            const moviesSelected = moviesFromRedux.filter(movie => movie.category === categorySelected)
            setAllMoviesToDisplay(moviesSelected)
        }
    }, [categorySelected])

    const choiceNumber = (numberOnPage, page) => {
       // let movies = 
    } 


    let items = [];
    for (let number = 1; number <= numberOfPages; number++) {
    items.push(
        <div 
            key={number} 
            className='pagination_button'
            style={{cursor:'pointer', backgroundColor: active === number && '#696969'}}
            onClick={()=> setActive(number)}
        >
            {number}
        </div>,
    );
    }

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
                                        <option style={{color:'red'}}>{category}</option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <div style={{width:'100%', display:'flex'}}>
                <div className='row_pagination'>
                    {items}

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
