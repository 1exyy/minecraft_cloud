import React from 'react';
import {Navigate} from 'react-router';

const isAuthenticated = true;

interface Props {
    children: React.ReactNode;
}

const RequireAuth: React.FC<Props> = ({children}) => {
    if (!isAuthenticated) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default RequireAuth;