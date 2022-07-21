export enum Categories {
    MoviesComing = 'movies-coming',
    MoviesInTheaters = 'movies-in-theaters',
    TopRatedIndia = 'top-rated-india',
    TopRatedMovies = 'top-rated-movies',
    Favourite = 'favourite',
}

export default interface ICategory {
    category: Categories
}