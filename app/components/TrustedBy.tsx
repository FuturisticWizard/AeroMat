import TrustedByGrid from "./TrustedByGrid";

const TrustedBy = () => {
  return (
    <section className="py-16 md:py-20 mb-[150px] px-4 sm:px-8">
      <div className="flex flex-row justify-center items-center pb-10 md:pb-14">
        <span className="border-b border-solid border-white/20 w-8 h-1" />
        <h3 className="text-center px-4 text-white">Zaufały Mi Silne Marki:</h3>
        <span className="border-b border-solid border-white/20 w-8 h-1" />
      </div>
      <TrustedByGrid />
    </section>
  );
};

export default TrustedBy;
