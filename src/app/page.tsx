import fs from "fs";
import path from "path";
import Gallery from "./components/gallery";

export default function Home() {
  // Get a list of image filenames in the 'public/images' directory
  const imageDirectory = path.join(process.cwd(), "public/images");
  const imageFilenames = fs.readdirSync(imageDirectory);

  return (
    <main>
      <Gallery images={imageFilenames} />
    </main>
  );
}
