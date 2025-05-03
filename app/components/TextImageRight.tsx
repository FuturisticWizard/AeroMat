import Image from "next/image";
import { Button } from "@/app/components/ui/button";

interface TextImageRightProps {
  number?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function TextImageRight({
  number = "01",
  title = "Title",
  subtitle = "Residential Projects",
  accentColor = "#0C8FC3",
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
  imageSrc = "/placeholder.png",
  imageAlt = "Residential interior",
}: TextImageRightProps) {
  return (
    <div className=" w-full max-w-7xl mx-auto px-4 ">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-5 lsm:mb-8 relative inline-block">
        {title}
        <div
          className={`absolute -bottom-3 left-0 right-0 h-4  -z-10 transform -rotate-1`}
          style={{ backgroundColor: accentColor }}
        ></div>
      </h2>

      {/* Content Card */}
      <div className="relative bg-gray-50 rounded-3xl xxs:py-4 xxs:px-6 sm:py-4 sm:px-8 md:p-12 shadow-lg">
        <div className="flex flex-col md:flex-row xxs:gap-4 lsm:gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={` text-6xl  lmd:text-7xl font-bold`}
                style={{ color: accentColor }}
              >
                {number}
              </span>
              <h3 className="xxs:text-xl sm:text-xl md:text-xl lmd:text-2xl font-bold ">
                {subtitle}
              </h3>
            </div>
            <p className="xxs:text-base sm:text-md lsm:text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
            <Button className="bg-[#0C8FC3] hover:bg-[#0A7DAB] text-white rounded-full px-8">
              Więcej
            </Button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/3]  sm:aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={imageSrc || "/placeholder.png"}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
