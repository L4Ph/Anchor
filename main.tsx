import { Hono } from "hono";
import { FC } from "hono/jsx";
import {
  Clock,
  Github,
  Globe,
  Music,
  User,
} from "https://esm.sh/lucide@0.474.0";
import { LucideIcon } from "./utils/lucide-icon.tsx";
import { LanyardResponse, LanyardResponseData } from "./types/lanyard.ts";
import { getActivePlatforms } from "./utils/get-active-platforms.ts";
import { getActivityNames } from "./utils/get-activity-names.ts";
import { getGitHubUrl } from "./utils/get-github-url.ts";
// import * as clippy from "https://deno.land/x/clippy@v1.0.0/mod.ts";

const app = new Hono();

const Layout: FC = (props) => {
  return (
    <html>
      <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      <body>{props.children}</body>
    </html>
  );
};

const Top: FC<{ userData: LanyardResponseData }> = ({ userData }) => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <div className="relative">
                <img
                  src={`https://cdn.discordapp.com/avatars/${userData.discord_user.id}/${userData.discord_user.avatar}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg"
                />
              </div>
              <div>
                <h1 className="mt-6 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  {userData.discord_user.global_name}
                </h1>
                {getGitHubUrl(userData) && (
                  <div className="mt-4 flex items-center gap-2">
                    <LucideIcon class="w-5 h-5 text-gray-300" icon={Github} />
                    <a
                      href={getGitHubUrl(userData)!.url}
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getGitHubUrl(userData)!.username}
                    </a>
                  </div>
                )}
                {
                  /* <button
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 transition text-white rounded-lg shadow-md"
                    onClick={copyUsername}
                  >
                  <LucideIcon class="w-5 h-5" icon={Clipboard} />
                  <span>Copy Name</span>
                </button> */
                }
              </div>
              {userData.kv.profile && (
                <p className="mt-4 text-gray-300 text-lg">
                  {userData.kv.profile}
                </p>
              )}
            </div>

            {/* Currently Playing */}
            {userData.spotify?.song && (
              <div className="flex-1">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                    <LucideIcon
                      class={"w-5 h-5 text-purple-400"}
                      icon={Music}
                    />
                    Currently Playing
                  </h2>
                  <div className="flex items-center gap-4">
                    <img
                      src={userData.spotify.album_art_url}
                      alt="Album Art"
                      className="w-24 h-24 rounded-lg shadow-lg"
                    />
                    <div>
                      <h3 className="font-medium text-lg">
                        {userData.spotify.song}
                      </h3>
                      <p className="text-gray-400">{userData.spotify.artist}</p>
                      <p className="text-gray-500 text-sm">
                        {userData.spotify.album}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <LucideIcon class={"w-5 h-5 text-purple-400"} icon={User} />
                <h3 className="text-lg font-medium">Discord Status</h3>
              </div>
              <p className="mt-2 text-green-400">{userData.discord_status}</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <LucideIcon class={"w-5 h-5 text-purple-400"} icon={Globe} />
                <h3 className="text-lg font-medium">Platform</h3>
              </div>
              <p className="mt-2 text-gray-300">
                {getActivePlatforms(userData)}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <LucideIcon class={"w-5 h-5 text-purple-400"} icon={Clock} />
                <h3 className="text-lg font-medium">Activity</h3>
              </div>
              <p className="mt-2 text-gray-300">{getActivityNames(userData)}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

app.get("/", (c) => {
  return c.redirect("https://github.com/L4Ph/Anchor", 301);
});

app.get("/users", (c) => {
  const userId = c.req.param("userId");
  return c.redirect(`/users/${userId}`);
});

app.get("/users/:userId", async (c) => {
  const userId = c.req.param("userId");

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);

    if (!response.ok) {
      return c.text(
        `API request failed: ${response.statusText}`,
        // deno-lint-ignore no-explicit-any
        response.status as any,
      );
    }

    const text = await response.text();
    const data: LanyardResponse = JSON.parse(text);

    return c.html(<Top userData={data.data} />);
  } catch (error) {
    console.error("Error:", error);
    return c.text("Internal Server Error", 500);
  }
});

Deno.serve(app.fetch);
