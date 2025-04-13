import App from "./App";
import ErrorPage from "./components/ErrorPage/ErrorPage";
// import Post from "./components/Post/Post";
import Home from "./components/Home/Home";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      // { path: "comments", element: <Comments /> },
      // { path: "posts", element: <Posts /> },
    ],
  },
];

export default routes;
