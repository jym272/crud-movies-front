export const Page = {
    Home: 'Home',
    Movies: 'Movies',
    Catalog: 'Catalog',
    Genres: 'Genres',

}


export type Genres = {
    [key: string]: string
}

export type MovieType = {
    id: number
    title: string
    description: string
    year: number
    release_date: string
    runtime: number
    rating: number
    mpaa_rating: string
    genres: Genres
}

