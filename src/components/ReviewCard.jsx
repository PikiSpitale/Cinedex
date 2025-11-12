export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-800 p-3 rounded shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold">{review.user || "Anon"}</div>
          <div className="text-xs text-gray-300">{new Date(review.date).toLocaleString()}</div>
        </div>
        {review.rating ? (
          <div className="flex items-center gap-2" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-sm ${review.rating >= i ? "text-yellow-400" : "text-gray-500"}`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-gray-300 ml-2">{review.rating}</span>
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-gray-200">{review.text}</p>
    </div>
  );
}
