export function youtubeEmbedUrl(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtube.com" && parsed.pathname.startsWith("/embed/")) {
      return `https://www.youtube.com/embed/${parsed.pathname.split("/embed/")[1].split("?")[0]}`;
    }

    if (host === "youtube.com" && parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host === "youtube.com" && parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "").split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

export function youtubeExternalUrl(url: string) {
  const embed = youtubeEmbedUrl(url);
  if (!embed) return url;
  const id = embed.split("/embed/")[1];
  return `https://www.youtube.com/watch?v=${id}`;
}
