import {createContext,useContext,useEffect,useState} from 'react'
import { getCurrentUser } from '../api/usersApi'
import { loginUser, logoutUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async() => {
            try{
                const response = await getCurrentUser();
                setUser(response.data);
            }catch(error){
                setUser(null);
            }finally{
                setLoading(false);
            }
        };

        checkAuth();
    },[]);

    const login = async (credential) => {
        await loginUser(credential);

        const response = await getCurrentUser();

        setUser(response.data);

        return response.data;
    }

    const logout = async () => {
        try{
            await logoutUser();
        }finally{
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{user,loading,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}
