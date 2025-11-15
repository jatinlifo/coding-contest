import { createContext, useContext, useState } from "react";

//ya sabko provide kar dega

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    return (
        <AuthContext.Provider value={{
            isLoggedIn, setIsLoggedIn,
            userId, setUserId,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}