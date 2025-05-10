export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen flex flex-grow-0 mx-0 ml-0 px-0">
      <div className="w-[14%] md:w-[16%] lg:w-[18%]  bg-blue-500">
        left
      </div>
      <div className="w-[86%] md:w-[84%] lg:w-[82%]  bg-red-500">
        {children}
      </div>
    </div>
  );
}
