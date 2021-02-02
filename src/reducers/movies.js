export default function(movies = [] , action) {

    if(action.type === 'setMovies'){
        return action.data
    }else {
        return movies 
    }
}