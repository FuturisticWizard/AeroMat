import AboutMe from "@/app/components/AboutMe";

export const metadata = {
  title: "O mnie | AeroMat",
  description: "Poznaj Mateusza — twórcę murali i filmów AeroMat.",
};

export default function OMniePage() {
  return (
    <main className="min-h-screen bg-black pt-16 sm:pt-18 md:pt-20 flex items-center">
      <AboutMe />
    </main>
  );
}
