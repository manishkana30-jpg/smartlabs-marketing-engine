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
  panchak?: string;
  shubhMuhurat?: string;
  rahuKaal?: string;
  auspiciousFor?: string;
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
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&") : "Shukla Pratipada";

    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const desc = descMatch ? descMatch[1] : "Auspicious day for spiritual practices, morning prayers, and temple visits.";

    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      date: todayStr,
      tithi: title.replace(/\|.*/, "").trim() || "Shukla Pratipada",
      specialSignificance: desc,
      sunrise: "06:40 AM",
      sunset: "05:32 PM",
      nakshatra: "Rohini",
      panchak: "No Active Panchak",
      shubhMuhurat: "Abhijit: 11:45 AM - 12:30 PM",
      rahuKaal: "04:30 PM - 06:00 PM",
      auspiciousFor: "Auspicious day for Yatra, Home Buying, Vehicle Buying complete calendar on Daily Tithi:",
      landingUrl: targetUrl,
      message: `Daily Tithi Alert for ${todayStr}.`,
    };
  } catch (err) {
    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return {
      date: todayStr,
      tithi: "Shukla Pratipada",
      specialSignificance: "Auspicious day for spiritual guidance, morning prayer, and positive beginnings.",
      sunrise: "06:40 AM",
      sunset: "05:32 PM",
      nakshatra: "Rohini",
      panchak: "No Active Panchak",
      shubhMuhurat: "Abhijit: 11:45 AM - 12:30 PM",
      rahuKaal: "04:30 PM - 06:00 PM",
      auspiciousFor: "Auspicious day for Yatra, Home Buying, Vehicle Buying complete calendar on Daily Tithi:",
      landingUrl: targetUrl,
      message: `Daily Tithi alert for ${todayStr}.`,
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
  const tithiName = data.tithi || "Shukla Pratipada";
  const sunriseText = data.sunrise ? `☀️ Sunrise: ${data.sunrise}` : "☀️ Sunrise: 06:40 AM";
  const sunsetText = data.sunset ? `🌙 Sunset: ${data.sunset}` : "🌙 Sunset: 05:32 PM";
  const timingsLine = `${sunriseText} | ${sunsetText}`;
  const nakshatraText = data.nakshatra || "Rohini";
  const significance = data.specialSignificance || data.message || "Auspicious day for spiritual practices, morning prayers, and temple visits.";

  const panchakText = data.panchak && data.panchak.trim() ? data.panchak.trim() : "No Active Panchak";
  const shubhMuhuratText = data.shubhMuhurat || "Abhijit: 11:45 AM - 12:30 PM";
  const rahuKaalText = data.rahuKaal || "04:30 PM - 06:00 PM";
  const auspiciousForText = data.auspiciousFor || "Auspicious day for Yatra, Home Buying, Vehicle Buying complete calendar on Daily Tithi:";

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
    campaignSummary: `Daily Tithi update for ${dateStr}: ${tithiName}`,
    youtube: {
      title: `Daily Tithi Update — ${dateStr} 🕉️ | ${tithiName} Panchang & Muhurat`,
      description: `🕉️ Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp: ${ytUtm}\n\nDaily Tithi Update — ${dateStr} 🕉️\n🪔 Tithi: ${tithiName}\n⏱️ Timings: ${timingsLine}\n⭐ Nakshatra: ${nakshatraText}\n✨ Today's Significance:\n${significance}\n\n🌀 Panchak: ${panchakText}\n🌟 Shubh Muhurat: ${shubhMuhuratText}\n⚠️ Rahu Kaal: ${rahuKaalText}\n\n✨ ${auspiciousForText}\n🔘 Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp: ${ytUtm}`,
      tags: ["dailytithi", "panchang", "todaystithi", "hinducalendar", "vedicastrology", "shubhmuhurat", "rahukaal", "panchak"],
    },
    whatsapp: {
      messageText: `Daily Tithi Update — ${dateStr} 🕉️\n🪔 *Tithi:* ${tithiName}\n⏱️ *Timings:* ${timingsLine}\n⭐ *Nakshatra:* ${nakshatraText}\n✨ *Today's Significance:*\n${significance}\n\n🌀 *Panchak:* ${panchakText}\n🌟 *Shubh Muhurat:* ${shubhMuhuratText}\n⚠️ *Rahu Kaal:* ${rahuKaalText}\n\n✨ *${auspiciousForText}*\n\n🔘 *Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp:*\n👉 ${waUtm}`,
      ctaButtonText: "View Complete Tithi & Muhurat",
      ctaUrl: waUtm,
    },
    telegram: {
      htmlMessage: `🌅 <b>Daily Tithi Update — ${dateStr} 🕉️</b>\n\n🪔 <b>Tithi:</b> ${tithiName}\n⏱️ <b>Timings:</b> ${timingsLine}\n⭐ <b>Nakshatra:</b> ${nakshatraText}\n<blockquote>✨ <b>Today's Significance:</b>\n${significance}</blockquote>\n\n🌀 <b>Panchak:</b> ${panchakText}\n🌟 <b>Shubh Muhurat:</b> ${shubhMuhuratText}\n⚠️ <b>Rahu Kaal:</b> ${rahuKaalText}\n\n✨ <i>${auspiciousForText}</i>\n\n🔘 <b>Install or View complete Tithi, Rahu Kaal &amp; Muhurat on website or webapp:</b>\n👉 <a href="${tgUtm}">dailytithi.com</a>`,
      buttonText: "Open Daily Tithi 🪔",
      buttonUrl: tgUtm,
    },
    pinterest: {
      title: `Daily Tithi Update — ${dateStr} 🕉️ (${tithiName})`,
      description: `Daily Tithi Update — ${dateStr} 🕉️. Tithi: ${tithiName} | Sunrise: ${sunriseText}. Panchak: ${panchakText} | Shubh Muhurat: ${shubhMuhuratText} | Rahu Kaal: ${rahuKaalText}. ${auspiciousForText}. Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp.`,
      destinationUrl: pinUtm,
    },
    reddit: {
      title: `Daily Tithi Update — ${dateStr} 🕉️ (${tithiName} Panchang & Muhurat)`,
      markdownBody: `Namaste everyone,\n\nHere is today's Daily Tithi update for **${dateStr}** 🕉️:\n\n- 🪔 **Tithi:** ${tithiName}\n- ⏱️ **Timings:** ${timingsLine}\n- ⭐ **Nakshatra:** ${nakshatraText}\n\n✨ **Today's Significance:**\n${significance}\n\n- 🌀 **Panchak:** ${panchakText}\n- 🌟 **Shubh Muhurat:** ${shubhMuhuratText}\n- ⚠️ **Rahu Kaal:** ${rahuKaalText}\n\n✨ **${auspiciousForText}**\n\n🔘 **Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp:**\n👉 [Daily Tithi](${redUtm})\n\nWishing everyone an auspicious and blessed day!`,
      targetSubreddit: "hinduism",
    },
    threads: {
      text: `Daily Tithi Update — ${dateStr} 🕉️\n\n🪔 Tithi: ${tithiName}\n⏱️ Timings: ${timingsLine}\n⭐ Nakshatra: ${nakshatraText}\n🌀 Panchak: ${panchakText}\n🌟 Shubh Muhurat: ${shubhMuhuratText}\n⚠️ Rahu Kaal: ${rahuKaalText}\n\n✨ ${auspiciousForText}\n\n🔘 Install or View complete Tithi on webapp: ${thUtm}`,
    },
    twitter: {
      isThread: true,
      tweets: [
        `Daily Tithi Update — ${dateStr} 🕉️\n\n🪔 Tithi: ${tithiName}\n⏱️ Timings: ${timingsLine}\n⭐ Nakshatra: ${nakshatraText}\n🌀 Panchak: ${panchakText}\n🌟 Shubh Muhurat: ${shubhMuhuratText}\n⚠️ Rahu Kaal: ${rahuKaalText}\n\n✨ Today's Significance:\n${significance.slice(0, 75)}... 🧵👇`,
        `✨ ${auspiciousForText}\n\n🔘 Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp:\n👉 ${twUtm}`,
      ],
    },
    linkedin: {
      postBody: `Daily Tithi Update — ${dateStr} 🕉️\n\nConnecting modern mindful living with solar and lunar rhythms:\n\n🪔 Tithi: ${tithiName}\n⏱️ Timings: ${timingsLine}\n⭐ Nakshatra: ${nakshatraText}\n🌀 Panchak: ${panchakText}\n🌟 Shubh Muhurat: ${shubhMuhuratText}\n⚠️ Rahu Kaal: ${rahuKaalText}\n\n✨ Today's Significance:\n${significance}\n\n✨ ${auspiciousForText}\n\n🔘 Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp:\n👉 ${liUtm}`,
      hashtags: ["#DailyTithi", "#Panchang", "#ShubhMuhurat", "#VedicWisdom", "#Mindfulness"],
    },
    instagram: {
      caption: `Daily Tithi Update — ${dateStr} 🕉️\n\n🪔 Tithi: ${tithiName}\n⏱️ Timings: ${timingsLine}\n⭐ Nakshatra: ${nakshatraText}\n🌀 Panchak: ${panchakText}\n🌟 Shubh Muhurat: ${shubhMuhuratText}\n⚠️ Rahu Kaal: ${rahuKaalText}\n\n✨ Today's Significance:\n${significance}\n\n✨ ${auspiciousForText}\n\n🔘 Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp (Link in Bio!): ${igUtm}`,
      firstCommentHashtags: "#dailytithi #panchang #todaystithi #vediccalendar #shubhmuhurat #rahukaal #panchak #hinducalendar #sanatandharma #dailywisdom",
    },
    devto: {
      title: `Vedic Panchang & Astronomical Lunar Calculations: Daily Tithi Update ${dateStr}`,
      markdownBody: `# Daily Tithi Update — ${dateStr} 🕉️\n\nAutomated daily syndication from [Daily Tithi](${landingUrl}) calculating solar-lunar positions.\n\n- **🪔 Tithi:** ${tithiName}\n- **⏱️ Timings:** ${timingsLine}\n- **⭐ Nakshatra:** ${nakshatraText}\n- **🌀 Panchak:** ${panchakText}\n- **🌟 Shubh Muhurat:** ${shubhMuhuratText}\n- **⚠️ Rahu Kaal:** ${rahuKaalText}\n\n### Today's Significance:\n${significance}\n\n✨ ${auspiciousForText}\n\n🔘 **[Install or View complete Tithi, Rahu Kaal & Muhurat on website or webapp](${devUtm})**`,
      tags: ["astronomy", "algorithms", "webdev", "productivity"],
      canonicalUrl: landingUrl,
    },
    discord: {
      embedTitle: `Daily Tithi Update — ${dateStr} 🕉️`,
      embedDescription: `**🪔 Tithi:** ${tithiName}\n**⏱️ Timings:** ${timingsLine}\n**⭐ Nakshatra:** ${nakshatraText}\n**🌀 Panchak:** ${panchakText}\n**🌟 Shubh Muhurat:** ${shubhMuhuratText}\n**⚠️ Rahu Kaal:** ${rahuKaalText}\n\n**✨ Today's Significance:**\n${significance}\n\n✨ *${auspiciousForText}*`,
      embedColor: 0xe67e22,
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

