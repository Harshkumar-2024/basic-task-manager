import {Navigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const ProtectedRoute = ({children}) => {
    const {user,loading} = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
            <div className="w-10 h-10 border-4 border-[var(--color-secondary)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            </div>
        );
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }
    
    return children;
}

export default ProtectedRoute
