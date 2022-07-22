import axios from 'axios';
import IMovie, { IMovieWithoutId } from '../models/IMovie';
import { Categories } from '../models/ICategory';

const baseURL = process.env.REACT_APP_BASE_URL;

/**
 * getMovies - Retrun list of movies in given category
 * @param category
 * @returns 
 */
async function getMovies(category: Categories): Promise<IMovie[]> {
    const response = await axios.get<IMovie[]>(`${baseURL}/${category}`);

    return response.data;
}

/**
 * getMovieById - Return Movie Details by Id
 * @param id
 * @returns 
 */
 async function getMovieById(category: Categories, id : string): Promise<IMovie> {
    const response = await axios.get<IMovie>(`${baseURL}/${category}/${id}`);

    return response.data;
}

/**
 * addMovieToFavourite - Add given Movie to Favourites List
 * @param movie 
 * @returns 
 */
async function addMovieToFavourite(movie : IMovieWithoutId) {
    const response = await axios.post<IMovie>(
        `${baseURL}/${Categories.Favourite}`,
        movie,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}

/**
 * removeMovieFromFavourite - Delete Movie, with given id, from Favourite List
 * @param id 
 * @returns 
 */
async function removeMovieFromFavourite(id : string) {
    const response = await axios.delete<IMovie>(
        `${baseURL}/${Categories.Favourite}/${id}`,
    );

    return response.data;
}

export {
    getMovies,
    getMovieById,
    addMovieToFavourite,
    removeMovieFromFavourite,
}