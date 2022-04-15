export const Page = {
    Home: 'Home',
    Movies: 'Movies',
    Catalog: 'Catalog',
    Genres: 'Genres',
    Add: 'Add',

}


export const GenresModel: Genres[] = [
    {id: 3, name: 'Action'},
    {id: 7, name: 'Adventure'},
    {id: 8, name: 'Comedy'},
    {id: 4, name: 'Comic Book'},
    {id: 2, name: 'Crime'},
    {id: 1, name: 'Drama'},
    {id: 6, name: 'Mystery'},
    {id: 9, name: 'Romance'},
    {id: 5, name: 'Sci-Fi'}
]


export type Genres = {
    id: number,
    name: string
}
export type GenresMap = {
    [key: number]: string
}

export type MovieType = {
    id: number
    title: string
    description: string
    year?: number
    release_date: string
    runtime: number
    rating: number
    mpaa_rating: string
    genres: GenresMap
}

export const MPAARating = {
    G: 'G',
    PG: 'PG',
    PG13: 'PG13',
    R: 'R',
    NC17: 'NC17',
}
