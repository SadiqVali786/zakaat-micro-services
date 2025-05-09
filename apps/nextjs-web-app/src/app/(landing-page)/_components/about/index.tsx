import Link from "next/link";
import Image from "next/image";
import Ellipse from "@/../public/background/ellipse.png";
import AboutProduct from "@/../public/landing-page/about/about-product.png";
import PlayButton from "@/../public/landing-page/about/play-button.png";

import { Pill } from "../global";

export const About = () => {
  return (
    <section
      className="mt-180-to-250-with-768-to-1440 relative flex flex-col items-center justify-center gap-y-[3.75rem] overflow-x-hidden"
      id="about"
    >
      <Pill text="✨ Get Started For Free" />
      <Link href="#" className="w-[48rem] self-start md:w-full md:self-center">
        <Image src={AboutProduct} alt="Youtube Video" className="mx-auto" />
        <Image
          src={PlayButton}
          alt="Play Button"
          className="absolute top-[60%] left-[50%] z-20 -translate-x-1/2 -translate-y-1/2 transform"
        />
        <div className="from-brand-dark absolute top-[50%] right-0 bottom-0 left-0 z-10 bg-gradient-to-t" />
      </Link>
      <Image
        src={Ellipse}
        alt="Light"
        className="absolute -top-16 -z-10 h-[18.75rem] w-full sm:-top-10"
      />
    </section>
  );
};
