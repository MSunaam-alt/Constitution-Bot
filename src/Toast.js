export default function Toast({ msg }) {
  return (
    <>
      <div className="absolute z-[100] top-10 right-10 min-w-40 bg-green-700 text-white px-4 py-2 text-center">
        {msg}
      </div>
    </>
  );
}
