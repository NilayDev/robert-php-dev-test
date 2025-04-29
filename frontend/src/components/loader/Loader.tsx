import { useEffect } from "react";
import { shallowEqual } from "react-redux";

import { useAppSelector } from "../../store/hook";

import "./loader.css";

const Loader = () => {
  const { isLoaderOn } = useAppSelector((state) => state.loader, shallowEqual);
  useEffect(() => {
    if (isLoaderOn) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaderOn]);
  // return isLoaderOn && <div className="loader z-[9999999]"></div>;
  return isLoaderOn && (<div className="flex justify-center items-center h-full min-h-[500px] absolute z-[9999999] loader-wrapper">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>);
};

export default Loader;
