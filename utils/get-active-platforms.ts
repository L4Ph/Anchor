import type { LanyardResponseData } from "../types/lanyard.ts";

export const getActivePlatforms = (userData: LanyardResponseData) => {
  const platforms = [];
  if (userData.active_on_discord_web) platforms.push("Web");
  if (userData.active_on_discord_desktop) platforms.push("Desktop");
  if (userData.active_on_discord_mobile) platforms.push("Mobile");

  return platforms.length > 0 ? platforms.join(", ") : "Offline";
};
