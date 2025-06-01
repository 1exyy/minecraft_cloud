import ServerPage from '../pages/ServerPage/ServerPage.tsx';
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.tsx";
import DrivePage from "../pages/DrivePage/DrivePage.tsx";
import {createBrowserRouter} from "react-router";
import RequireAuth from "../components/hoc/RequireAuth.tsx";


const routes = createBrowserRouter([
    {
        path: '/server',
        element: (
            <RequireAuth>
                <ServerPage/>
            </RequireAuth>
        ),
    },
    {
        path: "/server/drive",


        element: <DrivePage/>
    },
    {
        path: '*',
        element: <NotFoundPage/>
    }
]);

export default routes;