(async () => {
  const { cmd } = await import('../command.js');

  const fetch = require('node-fetch');
  
  cmd({
      pattern: "ssweb",
      alias: ["screenshot", "screenweb"],
      react: "📸",
      desc: "Capture a screenshot of a website",
      category: "web-tools",
      use: '.ssweb <url>',
      filename: __filename
  },
  async (conn, mek, m, { from, reply, q, sender }) => {
      if (!q || !q.trim()) {
          return await reply("Please provide a website URL!");
      }
      
      try {
          const apiUrl = `https://apis.davidcyriltech.my.id/ssweb?url=${encodeURIComponent(q)}&device=tablet`;
          
          // Newsletter context info
          const newsletterContext = {
              mentionedJid: [sender],
              forwardingScore: 1000,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363292876277898@newsletter',
                  newsletterName: "𝐇𝐀𝐍𝐒 𝐓𝐄𝐂𝐇",
                  serverMessageId: 143,
              },
          };
          
          await conn.sendMessage(from, { image: { url: apiUrl }, caption: `Screenshot of ${q}`, contextInfo: newsletterContext }, { quoted: mek });
          
      } catch (error) {
          console.error(error);
          reply('An error occurred while processing your request. Please try again later.');
      }
  });
})();
