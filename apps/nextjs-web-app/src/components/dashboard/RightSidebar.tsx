import Searchbar from "../common/search-bar";
import PotentialContact from "../potential-contact";
import DP from "@/../public/dashboard/dp.png";

export default function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden max-h-screen min-w-[286px] flex-col gap-y-[60px] py-[30px] pl-[10px] xl:flex">
      <Searchbar />
      <div className="flex flex-col gap-y-5">
        <p className="text-lg text-blue-50">Who to follow?</p>

        <PotentialContact dp={DP} fullName="Sadiq Vali" />
        <PotentialContact dp={DP} fullName="Sadiq Vali" />
        <PotentialContact dp={DP} fullName="Sadiq Vali" />

        <p className="text-neutral-7 text-lg">Show More</p>
      </div>
    </aside>
  );
}
