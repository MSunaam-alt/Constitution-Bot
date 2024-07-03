export default function DraggableComponent({
  d,
  setDragged,
  setDraggedOver,
  selected,
}) {
  return (
    <>
      <div
        key={d.id}
        draggable
        onDrag={(e) => {
          setDragged(d);
          setDraggedOver(true);
        }}
        onDragEnd={(e) => {
          setDraggedOver(false);
        }}
        className={`flex flex-col p-2 items-center justify-center gap-2 cursor-pointer ${
          selected ? "border-2 border-blue-600" : ""
        }`}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black flex items-center justify-center">
          <img src={d.img} alt="Flag" className="w-52" draggable="false" />
        </div>
        <h3 className="text-center font-medium">{d.name} Constitution</h3>
      </div>
    </>
  );
}
