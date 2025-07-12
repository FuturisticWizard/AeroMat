import React from "react";

const Process = () => {
  return (
    <div className="grid grid-cols-1 lsm:grid-cols-2 lsm:grid-rows-5  w-full  font-[family-name:var(--font-geist-sans)] min-h-screen divide-x-2 divide-dashed divide-red-400 mt-20 max-w-7xl md:mx-auto justify-center ">
      <div className="flex flex-col  h-[600px] w-[600px]">
        <div className="flex flex-row ">
          <div className="flex flex-col border-2 border-solid border-green-400">
            <h2>Analizujemy</h2>
            <p>
              Teraz chwila przerwy dla Ciebie – my w tym czasie przeanalizujemy
              i dobierzemy odpowiednie rozwiązanie dla Twojego biznesu oraz
              założonego celu projektu.
            </p>
          </div>
          <div className="">
            <div className="rounded-full h-50 w-50 bg-purple-200"></div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col border-2 border-solid border-green-400">
            <h2>Rozpoczynamy pracę</h2>
            <p>
              Po zaakceptowaniu przez Ciebie naszej oferty podpisujemy umowę i
              od razu przechodzimy do działania. Dzięki wyczerpującym
              informacjom oraz dokładnej analizie możemy szybko rozpocząć
              tworzenie Twojego muralu lub wideo promocyjnego. Już po kilku
              dniach zauważysz, jak Twoja marka zyskuje na rozpoznawalności i
              atrakcyjności.
            </p>
          </div>
          <div className="">
            <div className="rounded-full h-50 w-50 bg-purple-200"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col  h-[600px] w-[600px]">
        <div className="flex flex-col">
          <div className="flex flex-col border-2 border-solid border-green-400">
            <h2>Przedstawiamy darmową ofertę</h2>
            <p>
              Gotowe! Nasz specjalista skontaktuje się telefonicznie (lub jeśli
              sobie życzysz – mailowo) i przedstawi Ci naszą ofertę. Całość
              otrzymasz również mailowo, by w każdej chwili móc wrócić do naszej
              propozycji i zapoznać się z jej szczegółami w dogodnej chwili.
            </p>
          </div>
          <div className="">
            <span className="rounded-full h-10 w-10 bg-purple-200"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;
