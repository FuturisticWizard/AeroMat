import Image from "next/image";
import React from "react";

// Mały ciemny blur placeholder (base64)
const blurPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBf/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzPT9Rv7e0tbaO9uEhgjWOJBKwVFAwABngAVZHkOp/wA7/v8AVKVKhZO5Nlblp//Z";

const Cards = () => {
  return (
    <section className="cards">
        <div className="card">
            <div className="card-marquee">
                <div className="marquee">
                    <h1>Sztuka na Murach</h1>
                    <h1>Kolor Zmienia Przestrzeń</h1>
                    <h1>Tworzę z Pasją</h1>
                    <h1>Graffiti z Duszą</h1>
                </div>
            </div>
            <div className="card-wrapper">
                <div className={"card-content"}>
                    <div className="card-title">
                        <h1>Murale Wielkoformatowe</h1>
                    </div>
                    <div className="card-description">
                        <p>Przekształcam szare ściany w żywe dzieła sztuki. Każdy mural to opowieść wyrażona kolorem i formą na wielkim płótnie miasta.</p>
                    </div>
                </div>
                <div className="card-img bg-neutral-900">
                    <Image
                        src="/images/s2a.jpg"
                        alt="Murale Wielkoformatowe"
                        fill
                        priority
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={blurPlaceholder}
                    />
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-wrapper">
                <div className="card-content">
                    <div className="card-title">
                        <h1>Szyldy i Logotypy</h1>
                    </div>
                    <div className="card-description">
                        <p>Ręcznie malowane szyldy i logotypy, które wyróżnią Twój biznes. Unikalne projekty łączące tradycyjne rzemiosło z nowoczesnym designem.</p>
                    </div>
                </div>
                <div className="card-img bg-neutral-900">
                    <Image
                        src="/images/magiczny-swiat.jpg"
                        alt="Szyldy i Logotypy"
                        fill
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={blurPlaceholder}
                    />
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-wrapper">
                <div className="card-content">
                    <div className="card-title">
                        <h1>Wnętrza i Dekoracje</h1>
                    </div>
                    <div className="card-description">
                        <p>Artystyczne malunki ścienne do domu, biura czy lokalu. Tworzę niepowtarzalne klimaty – od subtelnych wzorów po odważne kompozycje.</p>
                    </div>
                </div>
                <div className="card-img bg-neutral-900">
                    <Image
                        src="/images/mural-starowka.jpg"
                        alt="Wnętrza i Dekoracje"
                        fill
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={blurPlaceholder}
                    />
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-wrapper">
                <div className="card-content">
                    <div className="card-title">
                        <h1>Projekty Specjalne</h1>
                    </div>
                    <div className="card-description">
                        <p>Eventy, festiwale, akcje artystyczne. Realizuję niestandardowe projekty – live painting, warsztaty graffiti i współpraca z markami.</p>
                    </div>
                </div>
                <div className="card-img bg-neutral-900">
                    <Image
                        src="/images/5.jpg"
                        alt="Projekty Specjalne"
                        fill
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={blurPlaceholder}
                    />
                </div>
            </div>
        </div>
    </section>
  );
};

export default Cards;