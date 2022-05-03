import {NextComponentType, NextPageContext} from "next";
import React from "react";

export const Page = {
    Home: 'Home',
    Movies: 'Movies',
    Catalog: 'Catalog',
    Genres: 'Genres',
    Add: 'Add',
    GraphQL: 'GraphQL',
    About: 'About',
    Fav: 'fav',

}

export type Adjacent_Genres ={
    next: Genres
    previous: Genres
    actual: Genres
}


export type Genres = {
    id: number,
    name: string
}
export type GenresMap = {
    [key: number]: string
}

type time = string //1994-06-07T00:00:00Z

export type MovieType = {
    id: number
    title: string
    description: string
    year?: number
    release_date: time
    runtime: number
    rating: number
    mpaa_rating: string
    genres?: GenresMap
    genres_list?: Genres[]
    poster?: string
    isFavorite?: boolean
    adjacent_movies_ids?: {
        next: number,
        previous: number
    }
    withGenre?: {
        id: number,
        name: string
    }
}

export const MPAARating = {
    G: 'G',
    PG: 'PG',
    PG13: 'PG13',
    R: 'R',
    NC17: 'NC17',
}

//Authentication
export interface AuthEnabledComponentConfig {
    auth: boolean;
}

export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
    AuthEnabledComponentConfig;

export type NextComponentWithAuth = NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;


export type JWTType = {
    jwt: string
    expires: number
}