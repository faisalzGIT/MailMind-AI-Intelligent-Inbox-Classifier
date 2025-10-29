function EmailShimmer() {
  return (
    <div className="border p-4 rounded-xl shadow-sm animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/4"></div>
    </div>
  );
}
export default EmailShimmer;