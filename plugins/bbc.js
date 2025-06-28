import axios from "axios";
import config from "../config.cjs";

async function doReact(emoji, mek, Matrix) {
  try {
    await Matrix.sendMessage(mek.key.remoteJid, {
      react: { text: emoji, key: mek.key },
    });
  } catch (error) {
    console.error("Error sending reaction:", error);
  }
}

const bbcnews = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";

  if (!["bbcnews", "bbc"].includes(cmd)) return;

  // React with newspaper emoji
  await doReact("📰", m, Matrix);

  const newsletterContext = {
    mentionedJid: [m.sender],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363292876277898@newsletter",
      newsletterName: "𝐇𝐀𝐍𝐒 𝐓𝐄𝐂𝐇",
      serverMessageId: 143,
    },
  };

  try {
    const res = await axios.get("https://suhas-bro-api.vercel.app/news/bbc");
    const newsData = res.data;

    if (!newsData || newsData.length === 0) {
      return Matrix.sendMessage(m.from, { text: "❌ No news available at the moment." }, { quoted: m });
    }

    const article = newsData[0];

    let newsReply = `📰 *Latest BBC News*\n\n`;
    newsReply += `📅 *Date:* ${article.date}\n`;
    newsReply += `📝 *Title:* ${article.title}\n`;
    newsReply += `🗒️ *Summary:* ${article.summary}\n`;
    newsReply += `🔗 *Link:* ${article.link}\n\n`;
    newsReply += `*© POWERED BY LUNA MD*`;

    await Matrix.sendMessage(
      m.from,
      {
        text: newsReply,
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error fetching news:", error.message);
    await Matrix.sendMessage(
      m.from,
      { text: "❌ An error occurred while fetching the latest news." },
      { quoted: m }
    );
  }
};

export default bbcnews;
