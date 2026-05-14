import { createContext, useMemo, useState } from "react";

export const RewardContext = createContext(null);

export function RewardProvider({ children }) {
  const [rewards, setRewards] = useState([]);

  const value = useMemo(() => ({ rewards, setRewards }), [rewards]);
  return <RewardContext.Provider value={value}>{children}</RewardContext.Provider>;
}
