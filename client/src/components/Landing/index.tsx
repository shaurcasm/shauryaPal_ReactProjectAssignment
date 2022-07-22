import { useCallback, useState, useEffect } from 'react';
import { Tabs, Tab, Spinner, Alert } from 'react-bootstrap';

import { Categories } from '../../models/ICategory';
import IMovie from '../../models/IMovie';
import { getMovies } from '../../services/movies';
import Movies from '../Movies/index';


export default function Landing() {
    const [favourites, setFavourites] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchFavourites = useCallback(async () => {
        try {
            const favourites = await getMovies(Categories.Favourite);
            setFavourites( favourites );
        } catch (error) {
            setError( error as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavourites();
    }, [fetchFavourites]);

    if(loading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    if(!loading && error) {
        return (
            <Alert variant="danger">{error.message}</Alert>
        );
    }
    

    return (
        <Tabs
            defaultActiveKey={Categories.MoviesComing}
            id='landing-page-tab'
            className='mb-3 px-3 d-flex justify-content-evenly bg-light'
        >
            <Tab eventKey={Categories.MoviesComing} title='Coming Soon'>
                <Movies category={Categories.MoviesComing} favourites={favourites} setFavourites={setFavourites} fetchFavourites={fetchFavourites} />
            </Tab>
            <Tab eventKey={Categories.MoviesInTheaters} title='In Theatres'>
                <Movies category={Categories.MoviesInTheaters} favourites={favourites} setFavourites={setFavourites} fetchFavourites={fetchFavourites} />
            </Tab>
            <Tab eventKey={Categories.TopRatedIndia} title='Top Rated In India'>
                <Movies category={Categories.TopRatedIndia} favourites={favourites} setFavourites={setFavourites} fetchFavourites={fetchFavourites} />
            </Tab>
            <Tab eventKey={Categories.TopRatedMovies} title='Top Rated'>
                <Movies category={Categories.TopRatedMovies} favourites={favourites} setFavourites={setFavourites} fetchFavourites={fetchFavourites} />
            </Tab>
            <Tab eventKey={Categories.Favourite} title='Favourites'>
                <Movies category={Categories.Favourite} favourites={favourites} setFavourites={setFavourites} fetchFavourites={fetchFavourites} />
            </Tab>
        </Tabs>
    )
}