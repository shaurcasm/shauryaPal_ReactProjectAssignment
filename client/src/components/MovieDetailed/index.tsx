import { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';

import { Categories } from '../../models/ICategory';
import IMovie from '../../models/IMovie';
import { getMovieById } from '../../services/movies';
import MovieCard from '../MovieCard';

interface LocationState {
    category : Categories;
};
const MovieDetailed = () => {
    const params = useParams();
    const id = params.id as string;

    const location = useLocation();
    const state = location.state as LocationState;
    const { category = Categories.MoviesComing } = state || {};

    const [movie, setMovie] = useState<IMovie | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        console.log('id', id);
        console.log('category', category);
        (async () => {
            try {
                const movie = await getMovieById(category, id);

                setMovie(movie);                
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        })();
    }, [category, id]);

    return (
        <Container fluid className='h-100'>
            {
                loading &&
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {
                !loading && error && (
                    <Alert variant="danger">{error.message}</Alert>
                )
            }
            {
                !loading && !error && movie &&
                <MovieCard movie={movie} fullPage />
            }
        </Container>
    )
}

export default MovieDetailed;