import { Hono } from "hono";
import { FC } from "hono/jsx";
import {
  Clock,
  Github,
  Globe,
  Mail,
  Music,
  User,
} from "https://esm.sh/lucide@0.474.0";
import { LucideIcon } from "./utils/lucide-icon.tsx";
import { LanyardResponse, LanyardResponseData } from "./types/lanyard.ts";
import { getActivePlatforms } from "./utils/get-active-platforms.ts";
import { getActivityNames } from "./utils/get-activity-names.ts";
import { getGitHubUrl } from "./utils/get-github-url.ts";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/deno";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

// HeroSection
const HeroSection: FC<{ userData: LanyardResponseData }> = ({ userData }) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <img
          src={`https://cdn.discordapp.com/avatars/${userData.discord_user.id}/${userData.discord_user.avatar}`}
          alt="Profile"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-500 shadow-lg"
        />
      </div>
      <h1 className="mt-4 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        {userData.discord_user.global_name || userData.discord_user.username}
      </h1>

      <div className="flex flex-wrap gap-2 mt-2">
        {userData.kv.email && (
          <div className="flex items-center gap-1">
            <LucideIcon class="w-4 h-4 text-gray-300" icon={Mail} />
            <a
              href={`mailto:${userData.kv.email}`}
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {userData.kv.email}
            </a>
          </div>
        )}
        {getGitHubUrl(userData) && (
          <div className="flex items-center gap-1">
            <LucideIcon class="w-4 h-4 text-gray-300" icon={Github} />
            <a
              href={getGitHubUrl(userData)!.url}
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {getGitHubUrl(userData)!.username}
            </a>
          </div>
        )}
      </div>

      {userData.kv.profile && (
        <p className="mt-2 text-gray-400 text-base md:text-lg">
          {userData.kv.profile}
        </p>
      )}
    </div>
  );
};

// NowPlaying
const NowPlaying: FC<{ userData: LanyardResponseData }> = ({ userData }) => {
  return (
    <div className="flex-1">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <h2 className="flex items-center gap-1 text-lg font-semibold mb-2">
          <LucideIcon class={"w-4 h-4 text-purple-400"} icon={Music} />
          Now Playing
        </h2>
        <div className="flex items-center gap-2">
          <img
            src={userData.spotify?.album_art_url ||
              "https://images.placeholders.dev/?width=160&height=160&text=No%20song"}
            alt="Album Art"
            className="w-16 h-16 md:w-24 md:h-24 rounded-lg shadow-lg"
          />
          <div>
            <h3 className="font-medium text-base md:text-lg">
              {userData.spotify?.song || "There are no song."}
            </h3>
            <p className="text-gray-500 text-xs">{userData.spotify?.artist}</p>
            <p className="text-gray-600 text-xs md:text-sm">
              {userData.spotify?.album || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatsSection
const StatsSection: FC<{ userData: LanyardResponseData }> = ({ userData }) => {
  const stats = [
    {
      icon: User,
      title: "Discord Status",
      text: userData.discord_status,
      textColor: "text-green-400",
    },
    {
      icon: Globe,
      title: "Platform",
      text: getActivePlatforms(userData),
      textColor: "text-gray-400",
    },
    {
      icon: Clock,
      title: "Activity",
      text: getActivityNames(userData),
      textColor: "text-gray-400",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/30 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center gap-2">
              <LucideIcon class={"w-4 h-4 text-purple-400"} icon={stat.icon} />
              <h3 className="text-base font-semibold">{stat.title}</h3>
            </div>
            <p className={`mt-1 text-sm ${stat.textColor}`}>{stat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Top: FC<{ userData: LanyardResponseData }> = ({ userData }) => {
  return (
    <div className="font-display min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-12">
          <HeroSection userData={userData} />
          <NowPlaying userData={userData} />
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection userData={userData} />
    </div>
  );
};

app.get("/", (c) => {
  return c.redirect("https://github.com/L4Ph/Anchor", 301);
});

app.get("/users", (c) => {
  const userId = "819287687121993768";
  return c.redirect(`/users/${userId}`);
});

app.get(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="stylesheet" href="/static/tailwind.css" />
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);

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

    return c.render(<Top userData={data.data} />);
  } catch (error) {
    console.error("Error:", error);
    return c.text("Internal Server Error", 500);
  }
});

Deno.serve(app.fetch);
