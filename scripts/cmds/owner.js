const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "亗•𝘔𝘈𝘔𝘜𝘕✿᭄",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 𝗦𝗶𝘆𝗮𝗺 𝗔𝗵𝗺𝗲𝗱 𝗥𝗮𝗳𝗶
│🧸 Nɪᴄᴋ       : 𝗩𝗼𝗻𝗱𝗼
│ 🎂 Aɢᴇ        : 17+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : 𝗦𝗶𝗻𝗴𝗲𝗹
│ 🎓 Pʀᴏғᴇssɪᴏɴ : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : 𝗫10
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : 𝗞𝗵𝘂𝗹𝗻𝗮
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  :  id=61585437908438
│ 💬 Messenger: id=61585437908438
│ 📞 WhatsApp  : 01815843985
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://files.catbox.moe/ha6hv4.mp4";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send)
  }
};
