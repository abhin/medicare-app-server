export function generateFullServerUrl(req, url) {
  const protocol = req.protocol || "http";
  const host = req.get("host");
  return `${protocol}://${host}/${url}`;
}
