export default function AdminNavbar({ logout }) {
  return (
    <nav className="bg-indigo-200 p-4 flex justify-between items-center text-black">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <button
        onClick={logout}
        className="bg-gray-900 text-white px-4 py-1 rounded hover:bg-gray-800"
      >
        Logout
      </button>
    </nav>
  );
}