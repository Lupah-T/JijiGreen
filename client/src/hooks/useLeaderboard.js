import { getLeaderboard } from "../api/rewardsApi.js";
import { useFetch } from "./useFetch.js";

export const useLeaderboard = () => useFetch(async () => (await getLeaderboard()).data, []);
