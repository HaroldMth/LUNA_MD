import config from "../config.cjs";

async function doReact(emoji, m, Matrix) {
  try {
    await Matrix.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch (e) {
    console.error("❌ Reaction error:", e);
  }
}

const newsletterContext = {
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363292876277898@newsletter",
    newsletterName: "𝐇𝐀𝐍𝐒 𝐓𝐄𝐂𝐇",
    serverMessageId: 143,
  },
};

const getGroupInviteLinkCmd = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const body = m.body || "";
  if (!body.startsWith(prefix)) return;

  const parts = body.slice(prefix.length).trim().split(/ +/);
  const cmd = parts.shift().toLowerCase();

  if (!["grouplink", "gclink", "link", "invite"].includes(cmd)) return;

  const jid = m.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    await Matrix.sendMessage(
      jid,
      {
        text: "❌ This command only works in group chats!",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
    return;
  }

  await doReact("⏳", m, Matrix);

  try {
    const inviteCode = await Matrix.groupInviteCode(jid);
    const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

    await Matrix.sendMessage(
      jid,
      {
        text: `✨ *LUNA MD* – Invite Portal 🌐  
🔗 *Group Invite Link:*  
🔮 ${inviteLink}  
📥 Tap to join and unlock exclusive vibes 💬  
`,
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );

    await doReact("✅", m, Matrix);
  } catch (error) {
    console.error("GetGroupInviteLink Error:", error);
    await doReact("❌", m, Matrix);
    await Matrix.sendMessage(
      jid,
      {
        text: "❌ Failed to get group invite link. Make sure I have admin rights!",
        contextInfo: { ...newsletterContext, mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  }
};

export default getGroupInviteLinkCmd;
