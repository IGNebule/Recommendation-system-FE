import useAuth from "../hooks/useAuth";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

const getAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return "";

  if (avatarUrl.startsWith("http")) return avatarUrl;

  return `${API_ORIGIN}${avatarUrl}`;
};

const getInitial = (user) => {
  return (
    user?.name?.charAt(0) ||
    user?.username?.charAt(0) ||
    user?.email?.charAt(0) ||
    "U"
  ).toUpperCase();
};

const ProfilePage = () => {
  const { user } = useAuth();

  const avatarSrc = getAvatarSrc(user?.avatarUrl);

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 text-white">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#100f18] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="h-40 bg-gradient-to-r from-violet-600/40 via-[#66c0f4]/20 to-fuchsia-500/30" />

        <div className="-mt-16 px-8 pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-5">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name || user?.email}
                  className="h-32 w-32 rounded-3xl border-4 border-[#100f18] object-cover shadow-2xl"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-[#100f18] bg-violet-600 text-5xl font-black shadow-2xl">
                  {getInitial(user)}
                </div>
              )}

              <div className="pb-2">
                <h1 className="text-3xl font-black">
                  {user?.name || user?.username || "Unnamed User"}
                </h1>

                <p className="mt-1 text-sm text-white/45">{user?.email}</p>

                {user?.username && (
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-violet-300">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>

            <a
              href="/settings"
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-wide transition hover:bg-violet-500"
            >
              Edit Profile
            </a>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Bio
            </p>

            <p className="mt-3 leading-relaxed text-white/65">
              {user?.bio || "No bio yet. Add one from settings."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
