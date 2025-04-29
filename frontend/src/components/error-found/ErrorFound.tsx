import { Link } from "react-router-dom";

const ErrorFound = ({
  status = "404",
  title = "Something's missing.",
  description = "Sorry, We couldn't find what you are looking for!",
}) => {
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 h-screen flex items-center justify-center">
        <div className="mx-auto max-w-screen-md text-center">
          <h1 className="mb-4 text-6xl tracking-tight font-extrabold lg:text-6xl">
            {status}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            {title}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">{description}</p>
          <Link to="/">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
            >
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorFound;
