import Image from "next/image";

import iPhoneHero from "@/../public/iPhoneHero.png";
import GooglePlay from "@/../public/googlePlay.png";
import AppStore from "@/../public/appStore.png";
import Link from "next/link";
import Pill from "./Pill";

export default function HeroSection() {
  return (
    <section
      className="hero-margin-right mb-64 flex flex-col items-center justify-between gap-x-4 gap-y-11 md:flex-row"
      style={{ marginLeft: "clamp(1rem, 4.9vw, 5rem)" }}
    >
      <div className="flex flex-col" style={{ rowGap: "clamp(45px, 6.05vw, 90px)" }}>
        <div className="hero-left-items-row-gap flex flex-col">
          <Pill
            text="✨ Find Deserving Zakaat Recipients Here"
            className="mx-0 text-center sm:mx-auto"
          />
          <h1 className="font-bold leading-none" style={{ fontSize: "clamp(35px, 4.53vw, 65px)" }}>
            <span className="text-blue-200">Maximize Your Zakaat Impact, </span>
            <span className="text-purple-200">Support the Deserving Muslims in Need</span>
          </h1>
          <p
            className="text-xl leading-[26px] text-blue-100"
            style={{ fontSize: "clamp(16px, 1.7vw, 20px)" }}
          >
            Fulfill your duty of Zakat with purpose, backed by the power of Artificial Intelligence.
            Our platform ensures your contributions reach truly deserving Muslims by safeguarding
            against fraudulent applications. Connect with those genuinely in need.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href={"#"}>
            <Image
              src={AppStore}
              alt="App Store"
              style={{
                objectFit: "cover",
                width: "clamp(139px, 15.08vw, 181px)"
              }}
            />
          </Link>
          <Link href={"#"}>
            <Image
              src={GooglePlay}
              alt="Google Play"
              style={{
                objectFit: "cover",
                width: "clamp(139px, 15.08vw, 181px)"
              }}
            />
          </Link>
        </div>
      </div>
      <Image alt="Hero iPhone" src={iPhoneHero} className="iphone-img-width-media-query" />
    </section>
  );
}
