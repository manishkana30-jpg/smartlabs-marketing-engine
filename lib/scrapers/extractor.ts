export interface ExtractedSeed {
  title: string;
  description: string;
  url: string;
  summary: string;
}

/**
 * Extracts OpenGraph metadata, title, and key text from any product, changelog, or article URL.
 */
export async function extractSeedFromUrl(rawUrl: string): Promise<ExtractedSeed> {
  const targetUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (SmartLabsSeedBot/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch URL`);
    }

    const html = await res.text();

    // Extract Title
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
    const titleTagMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = (ogTitleMatch?.[1] || titleTagMatch?.[1] || "Product Update").trim();

    // Extract Description
    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const description = (ogDescMatch?.[1] || metaDescMatch?.[1] || "").trim();

    // Extract main paragraphs for context
    const bodyMatches = Array.from(html.matchAll(/<p[^>]*>(.*?)<\/p>/gi))
      .map((m) => m[1].replace(/<[^>]*>/g, "").trim())
      .filter((p) => p.length > 40)
      .slice(0, 3)
      .join(" ");

    const summary = description || bodyMatches || `Release announcement from ${targetUrl}`;

    return {
      title,
      description: summary,
      url: targetUrl,
      summary: `${title} — ${summary}`.slice(0, 350),
    };
  } catch (err: any) {
    // Graceful fallback if URL is blocked by CORS or network timeout
    const urlObj = new URL(targetUrl);
    const domainName = urlObj.hostname.replace(/^www\./, "");
    return {
      title: `Update from ${domainName}`,
      description: `New release and feature updates on ${targetUrl}`,
      url: targetUrl,
      summary: `Product update from ${domainName}: Discover the latest release and improvements on ${targetUrl}`,
    };
  }
}

