import {NextComponentType, NextPageContext} from "next";
import React from "react";

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
    genres: GenresMap
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