import YoutubeVideosGrid from "@/app/components/YoutubeVideosGrid";

export const metadata = {
  title: "Filmy | AeroMat",
  description: "Zobacz jak powstają murale — filmy z realizacji AeroMat.",
};

export default function FilmyPage() {
  return (
    <main className="min-h-screen bg-black pt-16 sm:pt-18 md:pt-20">
      <YoutubeVideosGrid />
    </main>
  );
}
