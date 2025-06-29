import { useNavigate } from "react-router-dom";

function BookCard({ data, onDelete, role }) {
  const navigate = useNavigate();

  const handleOpenPDF = () => {
    if (data?.book?.secure_url) {
      navigate("/preview", { state: { url: data.book.secure_url } });
    } else {
      alert("PDF not available");
    }
  };

  return (
    <div
      onClick={handleOpenPDF}
      className="text-white w-[22rem] h-[350px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700"
    >
      <div className="overflow-hidden">
        <img
          className="h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale-105 transition-all ease-in-out duration-300"
          src={data?.thumbnail?.secure_url}
          alt="book thumbnail"
        />
        <div className="p-3 space-y-1 text-white">
          <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
            {data?.title}
          </h2>
        </div>
      </div>
      {role === "ADMIN" && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering PDF open
            onDelete();
          }}
          className="m-3 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Book
        </button>
      )}
    </div>
  );
}

export default BookCard;
