import AboutProduct from "@/../public/AboutSection.png";
import PlayButton from "@/../public/PlayButton.png";
// import Ellipse from "@/../public/Ellipse.png";
import Image from "next/image";
import Link from "next/link";
import Pill from "./Pill";
import { BACKGROUND_IMAGES } from "@/lib/media-imports/background-images";

export default function AboutSection() {
  return (
    <div className="relative mb-64 flex flex-col items-center gap-y-14 overflow-hidden">
      <Pill text="✨ Get Started For Free" />
      <Link href="#" className="w-[768px] self-start md:w-full md:self-center">
        <Image src={AboutProduct} alt="Youtube Video" className="mx-auto" />
        <Image
          src={PlayButton}
          alt="Play Button"
          className="absolute left-[50%] top-[60%] z-20 -translate-x-1/2 -translate-y-1/2 transform"
        />
        <div className="from-brand-dark absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t" />
      </Link>
      <Image
        src={BACKGROUND_IMAGES.ellipse}
        alt="Light"
        className="absolute -top-16 -z-10 h-[300px] w-full sm:-top-10"
      />
    </div>
  );
}
