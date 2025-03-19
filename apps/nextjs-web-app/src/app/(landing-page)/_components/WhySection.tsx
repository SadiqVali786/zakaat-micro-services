import Image from "next/image";

import iPhoneWhy from "@/../public/iPhoneWhy.png";
import GooglePlay from "@/../public/googlePlay.png";
import AppStore from "@/../public/appStore.png";
import Link from "next/link";
import Pill from "./Pill";

export default function WhySection() {
  return (
    <div className="flex flex-col" style={{ rowGap: "clamp(45px, 6.05vw, 90px)" }}>
      <h2
        className="font-bold leading-none text-purple-100 md:text-center"
        style={{
          fontSize: "clamp(35px, 6vw, 55px)",
          marginLeft: "clamp(1rem, 4.9vw, 5rem)",
          marginRight: "clamp(1rem, 4.9vw, 5rem)"
        }}
      >
        Why Choose Our Platform for Donations?
      </h2>
      <div
        className="hero-margin-right mb-64 flex flex-col items-center justify-between gap-x-4 gap-y-11 md:flex-row"
        style={{ marginLeft: "clamp(1rem, 4.9vw, 5rem)" }}
      >
        <div className="flex flex-col" style={{ rowGap: "clamp(45px, 6.05vw, 90px)" }}>
          <div className="hero-left-items-row-gap flex flex-col">
            <Pill
              text="✨ Find Your Relatives, Friends & neighbours"
              className="mx-0 text-center sm:mx-auto"
            />
            <h2 className="font-bold leading-none" style={{ fontSize: "clamp(30px, 5vw, 45px)" }}>
              <span className="text-blue-200">
                Reaching out to friends and family for Zakaat can be challenging.{" "}
              </span>
              <span className="text-purple-200">
                Many may hesitate to request it out of dignity.
              </span>
            </h2>
            <p
              className="leading-[26px] text-blue-100"
              style={{ fontSize: "clamp(16px, 1.7vw, 20px)" }}
            >
              We simplify Zakaat donations by serving as a free intermediary for both donors and
              applicants. Donors can rely on us to connect them with their friends or relatives in
              need, if they’re on the platform. Applicants can choose to remain anonymous, though
              sharing details may increase donor trust and improve their chances of receiving
              Zakaat.
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
        <Image src={iPhoneWhy} alt="Hero iPhone" className="iphone-img-width-media-query" />
      </div>
    </div>
  );
}
