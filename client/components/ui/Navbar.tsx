import Image from "next/image";

const Navbar = () => {
  return (
    <header className="w-[100%] mb-5">
      <div className=" border-b-4  border-b-gray-400">
        <nav className="w-[95%] flex flex-row justify-between items-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={130}
            height={40}
            className="object-contain"
          />
          <h2 className=" text-md sm:text-lg font-medium  text-bold">Talk to stranger</h2>
          <p className="text-sm sm:text-lg">+5000 Online</p>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
