import { useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as outlineHeart } from '@fortawesome/free-regular-svg-icons';

import IMovie from '../../models/IMovie';
import { addMovieToFavourite, removeMovieFromFavourite } from '../../services/movies';
import './index.css';
import { Link } from 'react-router-dom';
import moment from 'moment';

const FullPageStyle = {
    img: {
        width: '75%',
        maxHeight: '500px',
        margin: 'auto',
    }
}
const ListStyle = {
    img: {
        width: '100%',
        height: '420px',
    }
}
type Props = {
    movie : IMovie,
    isFavourite? : boolean,
    setFavourites? : (movies : IMovie[] | ((movies : IMovie[]) => IMovie[])) => void,
    fullPage? : boolean,
}
const MovieCard = (props : Props) => {
    const { movie, fullPage, isFavourite, setFavourites } = props;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addToFavourite = () => {
        setLoading(true);
        (async () => {
            try {
                const response = await addMovieToFavourite(movie);

                if (!response) {
                    const favouriteError = new Error('Could not favour it');
                    setError(favouriteError);
                } else {
                    if(setFavourites) {
                        setFavourites((prevState : IMovie[]) => {
                            return [...prevState, response];
                        });
                    }
                }
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        })();
    }

    const removeFromFavourite = () => {
        setLoading(true);
        (async () => {
            try {
                const response = await removeMovieFromFavourite(movie.id);

                if (!response) {
                    const favouriteError = new Error('Could not unfavour it');
                    setError(favouriteError);
                } else {
                    if(setFavourites) {
                        setFavourites((prevState : IMovie[]) => {
                            return prevState.filter(prevMovies => prevMovies.id !== movie.id);
                        });
                    }
                }
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        })();
    }

    return (
        <Card className={classnames("text-center", {'movie-card': !fullPage})} style={{ width: fullPage ? '100%' : '18rem', height: fullPage ? '100%' : 'auto' }}>
            <Link to={`${movie.id}`} className="text-decoration-none">
                <Card.Img
                    variant="top"
                    src={movie.posterurl || 'images/default-movie-image.jpg'}
                    alt={`${movie.title}'s Poster`}
                    style={fullPage ? FullPageStyle.img : ListStyle.img}
                />
                <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>
                        Duration: {moment(movie.duration).format('HH[H] mm[M]') || 'Unknown'}
                        <br />
                        Content Rating: {movie.contentRating || 'N/A'}
                        {!setFavourites && movie.storyline}
                    </Card.Text>
                </Card.Body>
            </Link>
            {
                setFavourites &&
                <Card.Footer className="text-muted">
                    <Button
                        className="favourite-button text-decoration-none"
                        variant="link"
                        onClick={isFavourite ? removeFromFavourite : addToFavourite}
                        style={{ outline: 'none', boxShadow: 'none' }}
                    >
                        {
                            loading &&
                            <Spinner animation="grow" variant={classnames({'danger': !isFavourite, 'warning': isFavourite})} role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        }
                        {
                            !loading && error && (
                                <Alert variant="warning">{error.message}</Alert>
                            )
                        }
                        {
                            !loading && !error && movie &&
                            <>
                                <FontAwesomeIcon icon={isFavourite ? solidHeart : outlineHeart} className="text-danger" />
                                <span className="visually-hidden">Add to Favourites</span>
                            </>
                        }
                    </Button>
                </Card.Footer>
            }
        </Card>
    );
}

export default MovieCard;