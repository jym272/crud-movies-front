import {GenresMap, GenresModel} from "../../Types";

export const getIDs = (genres: string[]) => {
    const genresMap: GenresMap = {};
    genres.forEach((genre: string) => {
        const id = GenresModel.find(item => item.name === genre)?.id as number;
        genresMap[id] = genre;
    });
    return genresMap;
};