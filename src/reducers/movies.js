export default function(movies = [] , action) {

    if(action.type === 'setMovies') {
        return action.data
    } else if (action.type === 'updateMovies') {
        return(action.newList)
    } else {
        return movies 
    }
}