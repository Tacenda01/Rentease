export default function ReviewList() {
  const reviews = [
    { user: "Alok Singh", comment: "Nice property", rating: 4 },
    { user: "Meena Roy", comment: "Worst stay ever", rating: 1 },
  ];

  return (
    <ul className="space-y-2 mt-4">
      {reviews.map((r, i) => (
        <li key={i} className="bg-white border border-slate-300 rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{r.user}</p>
              <p className="text-sm text-gray-500">{r.comment}</p>
            </div>
            <div className="text-amber-500 font-bold">{r.rating}★</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
