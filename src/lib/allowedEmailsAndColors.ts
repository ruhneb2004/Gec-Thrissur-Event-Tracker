const envEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS;
export const allowedEmails = envEmails ? JSON.parse(envEmails) : [];
export const allowedColors = [
  "red",
  "blue",
  "green",
  "yellow",
  "violet",
  "orange",
  "black",
  "gray",
];
