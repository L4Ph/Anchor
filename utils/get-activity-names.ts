import { LanyardResponseData } from "../types/lanyard.ts";

export const getActivityNames = (userData: LanyardResponseData) => {
  if (!userData.activities || userData.activities.length === 0) {
    return "No Activities";
  }
  return userData.activities.map((activity) => activity.name).join(", ");
};
