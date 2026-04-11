import Image from "next/image";

const AboutMe = () => {
  return (
    <section
      id="o-mnie"
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-44 md:pt-12 md:pb-52 scroll-mt-48"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full mx-auto md:mx-0 overflow-hidden">
          <Image
            src="/images/portret.webp"
            alt="Mateusz - artysta AeroMat"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-4">
          <h2 className="text-6xl md:text-7xl font-[family-name:var(--font-bebas)] tracking-tight text-[#ff7302]">
          Kim jestem?
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold leading-snug text-white">
            Nazywam się Mateusz, malarstwo to moja pasja{" "}
            <span className="text-[#ff7302]">i sposób na życie.</span>
          </h3>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Od ponad 25 lat zajmuję się tym, co kocham, i dzięki zaufaniu moich
            klientów miałem okazję sprawdzić się w różnych technikach
            i kombinacjach. Podejmowanie nowych wyzwań pozwalało mi stale
            przekraczać własne granice i odkrywać nowe obszary mojej
            kreatywności.
          </p>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            Stacjonuję w <span className="text-white font-medium">Lublinie</span>, ale
            działam na terenie <span className="text-[#ff7302] font-medium">całego kraju</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
