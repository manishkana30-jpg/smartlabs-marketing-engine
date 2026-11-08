import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enqueueChannelDispatch } from "@/lib/queue/qstash";
import { Platform } from "@/lib/types";
import { buildChannelUtmMap, buildUtmUrl } from "@/lib/ai/utm";
import { CanonicalMarketingPayload } from "@/lib/ai/types";

export interface TithiPayload {
  date?: string;
  tithi?: string;
  paksha?: string;
  nakshatra?: string;
  sunrise?: string;
  sunset?: string;
  specialSignificance?: string;
  message?: string;
  landingUrl?: string;
  scrapeFromWebsite?: boolean;
}

/**
 * Scrapes today's tithi details from dailytithi.com if no payload is provided.
 */
async function scrapeDailyTithiFromSite(): Promise<TithiPayload> {
  const targetUrl = "https://dailytithi.com";
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "SmartLabsMarketingEngine/2.5 (DailyTithi Bot)",
      },
      next: { revalidate: 60 },
    });

    const html = await res.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&") : "Daily Tithi | Vedic Panchang & Sunrise Alerts";

    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const desc = descMatch ? descMatch[1] : "Today's Vedic Tithi, Panchang, and auspicious timings.";

    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      date: todayStr,
      tithi: title.replace(/\|.*/, "").trim() || "Vedic Tithi",
      specialSignificance: desc,
      landingUrl: targetUrl,
      message: `🌅 Daily Tithi Alert for ${todayStr}: Check today's Panchang, sunrise, and auspicious Muhurat.`,
    };
  } catch (err) {
    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return {
      date: todayStr,
      tithi: "Today's Vedic Tithi & Panchang",
      specialSignificance: "Auspicious daily tithi alert for spiritual guidance and timings.",
      landingUrl: targetUrl,
      message: `Daily Tithi and Panchang alert for ${todayStr}.`,
    };
  }
}

/**
 * Formats a spiritual, high-converting canonical marketing payload for DailyTithi
 */
function formatTithiMarketingPayload(
  data: TithiPayload,
  landingUrl: string
): CanonicalMarketingPayload {
  const dateStr = data.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const tithiName = data.tithi || "Panchang & Tithi";
  const sunriseText = data.sunrise ? `☀️ Sunrise: ${data.sunrise}` : "";
  const sunsetText = data.sunset ? `🌙 Sunset: ${data.sunset}` : "";
  const timingsLine = [sunriseText, sunsetText].filter(Boolean).join(" | ");
  const significance = data.specialSignificance || data.message || "Auspicious day for devotion, meditation, and good deeds.";

  const campaignSlug = `tithi-${Date.now()}`;
  const ytUtm = buildUtmUrl(landingUrl, Platform.YOUTUBE, campaignSlug);
  const waUtm = buildUtmUrl(landingUrl, Platform.WHATSAPP, campaignSlug);
  const tgUtm = buildUtmUrl(landingUrl, Platform.TELEGRAM, campaignSlug);
  const pinUtm = buildUtmUrl(landingUrl, Platform.PINTEREST, campaignSlug);
  const redUtm = buildUtmUrl(landingUrl, Platform.REDDIT, campaignSlug);
  const thUtm = buildUtmUrl(landingUrl, Platform.THREADS, campaignSlug);
  const twUtm = buildUtmUrl(landingUrl, Platform.TWITTER, campaignSlug);
  const liUtm = buildUtmUrl(landingUrl, Platform.LINKEDIN, campaignSlug);
  const igUtm = buildUtmUrl(landingUrl, Platform.INSTAGRAM, campaignSlug);
  const devUtm = buildUtmUrl(landingUrl, Platform.DEVTO, campaignSlug);
  const discUtm = buildUtmUrl(landingUrl, Platform.DISCORD, campaignSlug);

  return {
    campaignSummary: `Daily Tithi alert for ${dateStr}: ${tithiName}`,
    youtube: {
      title: `Today's Tithi & Panchang (${dateStr}) | Vedic Timings & Muhurat`,
      description: `🕉️ Check today's complete Panchang & Muhurat: ${ytUtm}\n\n📅 Date: ${dateStr}\n🪔 Tithi: ${tithiName}\n${timingsLine}\n\n✨ Significance:\n${significance}\n\nDownload Daily Tithi App or check online for live sunrise countdown and auspicious Choghadiya alerts.`,
      tags: ["dailytithi", "panchang", "todaystithi", "hinducalendar", "vedicastrology", "shubhmuhurat"],
    },
    whatsapp: {
      messageText: `🌅 *Daily Tithi Update — ${dateStr}* 🕉️\n\n🪔 *Tithi:* ${tithiName}\n${timingsLine ? `⏱️ *Timings:* ${timingsLine}\n` : ""}${data.nakshatra ? `⭐ *Nakshatra:* ${data.nakshatra}\n` : ""}✨ *Today's Significance:*\n${significance}\n\nCheck today's complete Choghadiya, Rahu Kaal & Muhurat on Daily Tithi:`,
      ctaButtonText: "View Today's Panchang",
      ctaUrl: waUtm,
    },
    telegram: {
      htmlMessage: `🌅 <b>Daily Tithi &amp; Vedic Panchang Update</b>\n📅 <i>${dateStr}</i>\n\n🪔 <b>Tithi:</b> ${tithiName}\n${timingsLine ? `⏱️ <b>Timings:</b> ${timingsLine}\n` : ""}${data.nakshatra ? `⭐ <b>Nakshatra:</b> ${data.nakshatra}\n` : ""}<blockquote>✨ <b>Significance:</b>\n${significance}</blockquote>\n\n<code>Daily Tithi Alerts • Real-time Vedic Panchang</code>`,
      buttonText: "Open Daily Tithi App 🪔",
      buttonUrl: tgUtm,
    },
    pinterest: {
      title: `Today's Tithi & Vedic Calendar — ${dateStr}`,
      description: `Daily Tithi and Panchang guide for ${dateStr}. Discover today's tithi (${tithiName}), auspicious sunrise timings, and spiritual significance.`,
      destinationUrl: pinUtm,
    },
    reddit: {
      title: `Today's Vedic Tithi & Panchang Discussion — ${dateStr} (${tithiName})`,
      markdownBody: `Namaste everyone,\n\nHere is today's daily Panchang and Tithi update for **${dateStr}**:\n\n- **Tithi:** ${tithiName}\n${timingsLine ? `- **Timings:** ${timingsLine}\n` : ""}${data.nakshatra ? `- **Nakshatra:** ${data.nakshatra}\n` : ""}\n\n**Significance:**\n${significance}\n\nYou can check full live sunrise counts, Rahu Kaal, and Choghadiya on [Daily Tithi](${redUtm}).\n\nWishing everyone a peaceful and blessed day!`,
      targetSubreddit: "hinduism",
    },
    threads: {
      text: `🌅 Daily Tithi Alert (${dateStr}): Today is ${tithiName}.\n\n${significance}\n\nCheck live Vedic timings and sunrise countdown: ${thUtm}`,
    },
    twitter: {
      isThread: true,
      tweets: [
        `🌅 Daily Tithi Update — ${dateStr} 🕉️\n\nToday's Tithi: ${tithiName}\n${timingsLine}\n\n✨ Significance:\n${significance.slice(0, 110)}... 🧵👇`,
        `Check complete live Panchang, Choghadiya, Rahu Kaal, and auspicious Muhurat on Daily Tithi:\n\n👉 ${twUtm}`,
      ],
    },
    linkedin: {
      postBody: `Mindfulness & Traditional Timings: Daily Tithi Update for ${dateStr}.\n\nIn our busy modern schedules, connecting with natural solar and lunar rhythms helps align daily focus and personal well-being.\n\nToday's Tithi: ${tithiName}\n${timingsLine}\n\nReflection for the day:\n${significance}\n\nExplore Daily Tithi: ${liUtm}`,
      hashtags: ["#DailyTithi", "#Mindfulness", "#Panchang", "#VedicWisdom", "#CulturalTech"],
    },
    instagram: {
      caption: `🌅 Daily Tithi Alert — ${dateStr} 🕉️\n\n🪔 Tithi: ${tithiName}\n${timingsLine}\n\n✨ Today's Thought:\n${significance}\n\n👉 Tap link in bio to download Daily Tithi App or view today's complete Choghadiya!`,
      firstCommentHashtags: "#dailytithi #panchang #todaystithi #vediccalendar #hinduism #sanatandharma #sunrisealert #shubhmuhurat #choghadiya #dailywisdom",
    },
    devto: {
      title: `Vedic Time Calculation & Solar-Lunar Algorithms: Daily Tithi Update ${dateStr}`,
      markdownBody: `# Daily Tithi Technical Update — ${dateStr}\n\nAutomated daily syndication from DailyTithi.com calculating astronomical lunar phases and solar sunrise events.\n\n- **Date:** ${dateStr}\n- **Tithi:** ${tithiName}\n- **Timings:** ${timingsLine}\n\n[Explore Daily Tithi Web App](${devUtm}).`,
      tags: ["astronomy", "algorithms", "webdev", "productivity"],
      canonicalUrl: landingUrl,
    },
    discord: {
      embedTitle: `🌅 Daily Tithi Alert — ${dateStr}`,
      embedDescription: `**Tithi:** ${tithiName}\n${timingsLine ? `**Timings:** ${timingsLine}\n` : ""}**Significance:** ${significance}`,
      embedColor: 0xe67e22, // Auspicious Saffron/Orange
      ctaUrl: discUtm,
    },
  };
}

/**
 * Inbound Webhook for dailytithi.com
 * Handles automated daily post dispatching across all connected channels.
 */
export async function POST(req: NextRequest) {
  try {
    let body: TithiPayload = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const secretHeader = req.headers.get("x-cron-secret") || req.headers.get("x-tithi-secret");
    const expectedSecret = process.env.CRON_SECRET;

    // If caller provided secret, verify. (Allows open webhook if secret is not set in env)
    if (expectedSecret && secretHeader && secretHeader !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized webhook caller" }, { status: 401 });
    }

    // If payload is empty or requested scrape, fetch directly from dailytithi.com
    const tithiData = body.tithi ? body : await scrapeDailyTithiFromSite();
    const landingUrl = tithiData.landingUrl || body.landingUrl || "https://dailytithi.com";

    // Format all 11 marketing platforms with Vedic Panchang formatting
    const canonicalPayload = formatTithiMarketingPayload(tithiData, landingUrl);

    // Save CampaignRun in database
    const workspaceId = "default-workspace";
    const workspace = await prisma.workspace.upsert({
      where: { slug: workspaceId },
      create: {
        id: workspaceId,
        name: "DailyTithi Production",
        slug: workspaceId,
        websiteUrl: landingUrl,
      },
      update: {
        websiteUrl: landingUrl,
      },
    });

    const idempotencyKey = `tithi:${new Date().toISOString().split("T")[0]}`;

    const campaignRun = await prisma.campaignRun.upsert({
      where: { idempotencyKey },
      create: {
        workspaceId: workspace.id,
        status: "PROCESSING",
        seedTopic: `Daily Tithi: ${tithiData.tithi || "Panchang Update"}`,
        targetUrl: landingUrl,
        canonicalPayload: JSON.stringify(canonicalPayload),
        idempotencyKey,
      },
      update: {
        canonicalPayload: JSON.stringify(canonicalPayload),
      },
    });

    // Query active channel connections
    const connections = await prisma.channelConnection.findMany({
      where: { workspaceId: workspace.id, status: "ACTIVE" },
    });

    // Enqueue dispatches with rate-limit staggering
    let delaySeconds = 0;
    const queuedChannels = [];

    for (const conn of connections) {
      await enqueueChannelDispatch(
        {
          campaignRunId: campaignRun.id,
          channelConnectionId: conn.id,
          channel: conn.platform as Platform,
          workspaceId: workspace.id,
        },
        delaySeconds
      );
      queuedChannels.push(conn.platform);
      delaySeconds += 10;
    }

    return NextResponse.json({
      success: true,
      message: `Daily Tithi received and formatted for ${tithiData.date || "Today"}!`,
      tithi: tithiData.tithi,
      date: tithiData.date,
      queuedChannelsCount: connections.length,
      queuedChannels,
      canonicalPayload,
    });
  } catch (error: any) {
    console.error("Daily Tithi webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process Daily Tithi message" },
      { status: 500 }
    );
  }
}

// Support GET for browser testing or cron pings
export async function GET(req: NextRequest) {
  return POST(req);
}

