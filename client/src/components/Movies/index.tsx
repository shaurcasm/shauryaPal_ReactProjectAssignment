import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Container, Row, Col, Spinner, Alert, InputGroup, Form } from 'react-bootstrap';

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
    const { category, favourites, fetchFavourites } = props;

    const [movies, setMovies] = useState<IMovie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const isFavourite = useCallback((title: string) => {
        return favourites.some(fav => fav.title === title);
    }, [favourites]);

    const handleSearchChange = (event : ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (value) {
            const newMovies = movies.filter(movie => movie.title.toLowerCase().includes(value.toLowerCase()));
            setFilteredMovies(newMovies);
        } else {
            setFilteredMovies(movies);
        }
    }

    useEffect(() => {
        setFilteredMovies(movies);
    }, [movies]);

    useEffect(() => {
        if(category !== Categories.Favourite) {
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
                <>
                    <Row xs={1} lg={2} className="justify-content-center">
                        <Col>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Search Movie"
                                    aria-label="Search Movie"
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row xs={1} md={2} lg='auto' className="my-n3 justify-content-center" >
                        {
                            filteredMovies.length > 0 &&
                            filteredMovies.map(movie => (
                                <Col key={movie.id} className="py-3">
                                    <MovieCard
                                        movie={movie}
                                        category={category}
                                        isFavourite={isFavourite(movie.title)}
                                        fetchFavourites={fetchFavourites}
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                </>
            }
        </Container>
    )
}

export default Movies;