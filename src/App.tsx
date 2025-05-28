import {RouterProvider} from "react-router";
import routes from "./router";

const App = () => {
    return <RouterProvider router={routes} />;
};

export default App;