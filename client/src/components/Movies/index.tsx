import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

import ICategory, { Categories } from '../../models/ICategory';
import IMovie from '../../models/IMovie';
import { getMovies } from '../../services/movies';
import MovieCard from '../MovieCard';

interface Props extends ICategory {
    favourites: IMovie[],
    setFavourites: (movies : IMovie[] | ((movies : IMovie[]) => IMovie[])) => void,
    fetchFavourites: () => void,
}
const Movies = (props : Props) => {
    const { category, favourites, setFavourites, fetchFavourites } = props;

    const [movies, setMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const isFavourite = useCallback((title: string) => {
        return favourites.some(fav => fav.title === title);
    }, [favourites]);

    useEffect(() => {
        if(category !== Categories.Favourite) {
            console.log('category', category);
            setError(null);
            setLoading(true);
            (async () => {
                try {
                    const fetchedMovies = await getMovies(category);
                    setMovies( fetchedMovies );
                } catch (error) {
                    setError( error as Error);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [category]);

    useEffect(() => {
        if(category === Categories.Favourite) {
            setMovies([...favourites]);
        }
    }, [category, favourites])

    useEffect(() => console.log('Movies', movies), [movies]);

    return (
        <Container fluid className='justify-content-center align-items-center py-4'>
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
                !loading && !error &&
                <Row xs={1} md={2} lg='auto' className="my-n3 justify-content-center" >
                    {
                        movies.length > 0 &&
                        movies.map(movie => (
                            <Col key={movie.id} className="py-3">
                                <MovieCard movie={movie} isFavourite={isFavourite(movie.title)} setFavourites={setFavourites} fetchFavourites={fetchFavourites} />
                            </Col>
                        ))
                    }
                </Row>
            }
        </Container>
    )
}

export default Movies;