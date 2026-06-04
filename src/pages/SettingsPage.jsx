import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import { profileService } from "../services";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

const getAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return "";

  if (avatarUrl.startsWith("http")) return avatarUrl;

  return `${API_ORIGIN}${avatarUrl}`;
};

const SettingsPage = () => {
  const { user, refreshProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    });

    setAvatarPreview(getAvatarSrc(user?.avatarUrl));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await profileService.updateProfile(form);

      if (avatarFile) {
        await profileService.updateAvatar(avatarFile);
      }

      await refreshProfile();

      setAvatarFile(null);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-[#100f18] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
          Settings
        </p>

        <h1 className="mt-3 text-4xl font-black">Edit Profile</h1>

        <p className="mt-2 text-sm text-white/50">
          Update your public profile and profile picture.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]"
        >
          <div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-48 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-violet-600 text-5xl font-black">
                  {user?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <label className="mt-4 block cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white">
                Upload Avatar
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              <p className="mt-3 text-xs leading-relaxed text-white/35">
                JPG, PNG, or WEBP. Max 2MB.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Display name"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#171622] px-4 text-sm outline-none placeholder:text-white/30 focus:border-violet-500"
            />

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#171622] px-4 text-sm outline-none placeholder:text-white/30 focus:border-violet-500"
            />

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Short bio"
              rows={6}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#171622] px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-violet-500"
            />

            {message && (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-black uppercase tracking-wide transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SettingsPage;
