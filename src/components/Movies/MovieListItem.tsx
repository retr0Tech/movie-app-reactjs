import { Rating } from "primereact/rating";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import  defaultImg from '../../assets/defaultImg.png';
import FavoriteMovie from "../FavoriteMarker";

export const MovieListItem = () => {
	return (movie: any) => {
		if(movie)
		{
			return (<div className="col-12">
			<div className="product-list-item">
				<img onError={ (e) => (e.target as any).src = defaultImg } src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : defaultImg} alt={movie.original_title} />
				<div className="product-list-detail">
				<Link to={{ pathname: `/movie/${movie.id}` }} className="no-style">
									<h3
										className="p-card-title"
										style={{ cursor: 'pointer', outline: 'none' }}
									>
										{ movie.original_title }
									</h3>
					</Link>
					<div className="product-description" ><p >{movie.overview}</p></div>
					<Rating value={movie.vote_average /2} readOnly cancel={false}></Rating>
					<p>{movie.release_date}</p>
					<FavoriteMovie movie={movie}></FavoriteMovie>
				</div>
				<div className="product-list-action">
					<span className="product-price">{movie.vote_average}/10</span>
				</div>
			</div>
		</div>)
		}
		return <></>
	};
}
export default MovieListItem;