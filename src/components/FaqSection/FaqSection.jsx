import FaqImage from "./FaqImage";
import Questions from "./Qustion";

export default function FaqSection() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-5 text-center mt-14 md:mt-20">
        Frequently asked questions
      </h1>
      <div className="">
        <div className="flex items-center justify-center flex-col mb-6"></div>
        <div className="flex flex-col-reverse justify-center items-center md:flex-row gap-7">
          <Questions />
          <FaqImage />
        </div>
      </div>
    </>
  );
}
