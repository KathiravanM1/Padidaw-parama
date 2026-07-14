import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Hash, BookOpen, Shield, Save, X } from "lucide-react";
import axios from "axios";

const ROLE_BADGE = {
  admin: "bg-red-100 text-red-700",
  senior: "bg-purple-100 text-purple-700",
  student: "bg-green-100 text-green-700",
};

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    rollNo: user?.rollNo || "",
    registrationNo: user?.registrationNo || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      rollNo: user?.rollNo || "",
    });
    setEditing(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser(res.data.user);
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
    setLoading(false);
  };

  const fields = [
    { label: "First Name", name: "firstName", icon: User, type: "text" },
    { label: "Last Name", name: "lastName", icon: User, type: "text" },
    { label: "Roll No", name: "rollNo", icon: Hash, type: "text" },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-start justify-center">
      <div className="w-full max-w-xl">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500 text-sm truncate">{user?.email}</p>
            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[user?.role] || "bg-gray-100 text-gray-600"}`}>
              {user?.role}
            </span>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex-shrink-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, name, icon: Icon, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={type}
                    name={name}
                    value={editing ? form[name] : (user?.[name] || "—")}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors ${
                      editing
                        ? "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                        : "border-transparent bg-gray-50 text-gray-600 cursor-default"
                    }`}
                  />
                </div>
              </div>
            ))}

            {/* Read-only fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-transparent bg-gray-50 text-gray-500 rounded-lg text-sm cursor-default"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={user?.role || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-transparent bg-gray-50 text-gray-500 rounded-lg text-sm cursor-default capitalize"
                />
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Member since */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
        </p>
      </div>
    </div>
  );
}
