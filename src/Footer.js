export default function Footer() {
  return (
    <>
      <footer className="bg-gray-700 text-white px-4 md:px-0 mt-2">
        <div className="container mx-auto py-10">
          <a href="/" className="text-2xl  font-medium">
            Constitution<span className="text-[red]">Bot.</span>
          </a>
          <div className="flex flex-col gap-2 mt-10">
            <div className="col-span-1">
              Developed by{" "}
              <a
                href="https://sunaam.web.app"
                className="underline "
                target="_blank"
              >
                Muhammad Sunaam
              </a>
            </div>
            <div className="col-span-1">
              Developed at <span className="font-bold">HPC Lab SEECS</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
