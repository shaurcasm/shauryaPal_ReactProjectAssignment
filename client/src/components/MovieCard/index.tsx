import { useState } from 'react';
import { Card, Button, Spinner, Alert, Toast } from 'react-bootstrap';
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
    fetchFavourites? : () => void,
    fullPage? : boolean,
}
const MovieCard = (props : Props) => {
    const { movie, fullPage, isFavourite, setFavourites, fetchFavourites } = props;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const [toastMessage, setToastMessage] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);

    const addToFavourite = () => {
        setLoading(true);
        (async () => {
            try {
                const requestMovie = { ...movie };
                delete requestMovie.id;
                const response = await addMovieToFavourite(requestMovie);
                
                if (!response) {
                    const favouriteError = new Error('Could not favour it');
                    setError(favouriteError);
                } else if (isFavourite) {
                    setToastMessage('Already Favourite')
                    setShow(true);
                } else if (fetchFavourites) {
                    await fetchFavourites();
                }
            } catch (error) {
                let message = 'Unknown Error'
                if (error instanceof Error) message = error.message
                if (message.includes('duplicate')) {
                    setToastMessage('Already Favourite')
                    setShow(true);
                } else setError(error as Error);
            } finally {
                setLoading(false);
            }
        })();
    }

    const removeFromFavourite = () => {
        setLoading(true);
        
            (async () => {
                try {
                    if (movie.id) {
                        const response = await removeMovieFromFavourite(movie.id);
                        
                        if (!response) {
                            const favouriteError = new Error('Could not unfavour it');
                            setError(favouriteError);
                        } else if (fetchFavourites) {
                            await fetchFavourites();
                        }
                    }
                } catch (error) {
                    let message = 'Unknown Error';
                    if (error instanceof Error) message = error.message
                    if (message.includes('duplicate')) {
                        setToastMessage('Already unfavoured it')
                        setShow(true);
                    } else setError(error as Error);
                } finally {
                    setLoading(false);
                }
            })();
    }

    return (
        <>
            <Card className={classnames("text-center", {'movie-card': !fullPage})} style={{ width: fullPage ? '100%' : '18rem', height: fullPage ? '100%' : 'auto' }}>
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
                <Link to={`${movie.id}`} className={classnames("text-decoration-none", {'pe-none': fullPage})}>
                    <Card.Img
                        variant="top"
                        src={movie.posterurl || 'images/default-movie-image.jpg'}
                        alt={`${movie.title}'s Poster`}
                        style={fullPage ? FullPageStyle.img : ListStyle.img}
                    />
                    <Card.Body>
                        <Card.Title>{movie.title}</Card.Title>
                        <Card.Text>
                            <p>Duration: {movie.duration ? moment.duration(movie.duration).humanize() : 'Unknown'}</p>
                            <p>Content Rating: {movie.contentRating || 'N/A'}</p>
                            {
                                !setFavourites && 
                                <>
                                    <p>{movie.storyline}</p>
                                </>
                            }
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
        </>
    );
}

export default MovieCard;