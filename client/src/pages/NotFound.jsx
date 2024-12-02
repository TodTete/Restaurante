import { Link } from "react-router-dom";
import logo from "../asset/logo.png";

export default function NotFound() {
  return (
    <div className=" items-center justify-center">
      <div className="flex ">
        <div className="w-1/2 text-center p-10">
          <h1 className="text-9xl font-bold text-[#449599]">404</h1>
          <h2 className="text-3xl font-semibold text-[#449599] mt-4">
            LO SIENTO, PÁGINA NO ENCONTRADA
          </h2>
          <p className="text-gray-700 mt-6 text-lg">
            La página que está buscando se movió, quitó, renombró o quizas nunca
            existio.
          </p>
          <h3>
            Si crees que es un error, contacte a vallejoricardo3@gmail.com.
          </h3>
          <Link to="/">
            <button className="mt-8 px-6 py-3 bg-[#449599] text-white rounded-lg">
              Volver
            </button>
          </Link>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <img
            src={logo}
            style={{ borderRadius: "40%" }}
            alt="Logo"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
