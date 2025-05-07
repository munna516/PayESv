

import { FaNodeJs, FaPhp, FaWhmcs, FaWordpress } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import { SiJquery } from "react-icons/si";
import { SiWoocommerce } from "react-icons/si";

const platforms = [
  { name: "PHP", image: <FaPhp />, color: "text-blue-500" },
  { name: "WordPress", image: <FaWordpress />, color: "text-purple-500" },
  { name: "JavaScript", image: <IoLogoJavascript />, color: "text-yellow-500" },
  { name: "jQuery", image: <SiJquery />, color: "text-blue-500" },
  { name: "Node JS", image: <FaNodeJs />, color: "text-green-500" },
  { name: "WOO Commerce", image: <SiWoocommerce />, color: "text-purple-500" },
  { name: "WHMCS", image: <FaWhmcs />, color: "text-teal-500" },
];

export default function SupportedPlatforms() {
  return (
    <section className=" mt-10 lg:mt-20">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-10 text-center">
        Supported Platforms
      </h2>
      <div className="flex justify-center flex-wrap items-center gap-10 sm:gap-14 md:gap-20  lg:gap-28 p-4">
        {platforms.map((platform, index) => (
          <div key={index} className="flex items-center flex-col ">
            <div
              className={`text-2xl sm:text-xl md:text-5xl lg:text-5xl ${platform.color} mr-2`}
            >
              {platform.image}
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              {platform.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
