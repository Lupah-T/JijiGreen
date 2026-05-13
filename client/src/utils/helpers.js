export const formatPoints = (points = 0) => `${Number(points).toLocaleString()} pts`;

export const formatDate = (date) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
