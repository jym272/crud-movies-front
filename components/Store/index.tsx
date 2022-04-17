import React from "react";

const defaultValue = {
    activePage: "",
    setActivePage: (page: string) => {
    },
    jwt: "",
    setJwt: (jwt: string) => {
    },
};

export const store = React.createContext(defaultValue);

export const StoreProvider = ({children}: { children: React.ReactNode }) => {
    const [activePage, setPage] = React.useState("");
    const [jwt, _setJwt] = React.useState("");

    const setActivePage = (page: string) => {
        setPage(page);
    };

    const setJwt = (jwt: string) => {
        _setJwt(jwt);
    };

    return (
        <store.Provider value={{
            activePage,
            setActivePage,
            jwt,
            setJwt,
        }}>
            {children}
        </store.Provider>
    );

};
