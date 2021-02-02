import React, {useEffect, useState} from 'react'

function CardMovie({movie}) {
   const [url, setUrl] = useState('')

    useEffect(() => {
        const query = movie.title.replace(' ', '+')
        const fechData = async () => { 
            const search = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=71b94f30b0afd7b23c94ff3d409f24bf&query=${query}`)
            const data = await search.json()
            setUrl(`https://image.tmdb.org/t/p/original${data.results[0].backdrop_path}`)
        }
        fechData()
   }, [])
    
    return (
        <div key={movie.id} className='card'>
            <div style={{
                backgroundSize:'cover',
                backgroundImage: `url("${url}")`,
                backgroundPosition:'center center',
                height:'150px',
                width: '90%',
                borderRadius:20,
            }}></div>
            
           
            <h1 className='card_title'>{movie.title}</h1>
            <div className='card_row_likes'>
                <p>👍 {movie.likes}</p>
                <p>👎 {movie.dislikes}</p>
            </div>
              
        </div>
    )
}

export default CardMovie
