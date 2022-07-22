export default interface IMovie {
    id?: string,
    title: string,
    year: string,
    genres: Array<string>,
    ratings: Array<number>,
    poster: string,
    contentRating: string,
    duration: string,
    releaseDate: string,
    averageRating: number,
    originalTitle: string,
    storyline: string,
    actors: Array<string>,
    imdbRating: number | string,
    posterurl: string,
}

export type IMovieWithoutId = Omit<IMovie, 'id'>