import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ErrorFound from "../components/error-found/ErrorFound";
import Translations from "../pages/translation/Translations";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Translations />,
          errorElement: (
            <ErrorFound
              status="500"
              title="Translations page Error"
              description="Something went wrong on the Translations page."
            />
          ),
        },
      ],
    },
    {
      path: "*",
      element: (
        <ErrorFound
          status="404"
          title="The page you're looking for doesn't exist."
          description="Sorry, We couldn't find what you are looking for!"
        />
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
