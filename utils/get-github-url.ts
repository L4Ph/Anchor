import { LanyardResponseData } from "../types/lanyard.ts";

export const getGitHubUrl = (userData: LanyardResponseData) => {
  if (userData.kv?.github) {
    const githubData = userData.kv.github;

    if (githubData.startsWith("https://") || githubData.startsWith("http://")) {
      return {
        username: githubData.replace(/^https?:\/\/(www\.)?github\.com\//, ""), // URLからユーザー名を抽出 (簡易版)
        url: githubData,
      };
    } else {
      return {
        username: githubData,
        url: `https://github.com/${githubData}`,
      };
    }
  }
  return null;
};
