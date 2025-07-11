import config from '../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoread') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_READ = "true";  // use string "true"
      responseMessage = "Auto-Read has been enabled.";
    } else if (text === 'off') {
      config.AUTO_READ = "false"; // use string "false"
      responseMessage = "Auto-Read has been disabled.";
    } else {
      responseMessage = "Usage:\n- `autoread on`: Enable Auto-Read\n- `autoread off`: Disable Auto-Read";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
