const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    aliases: ["admin", "intro", "contact"],
    version: "4.0.0",
    author: "MR_FARHAN",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "Owner Information"
    },
    category: "owner"
  },

  onStart: async function ({ api, event, usersData, threadsData, message }) {
    try {

      // ===== OWNER INFO =====
      const ownerName = "MOMIN-VAI";
      const ownerNick = "MOMIN";
      const ownerAge = "20+";
      const ownerFrom = "KURIGRAM";
      const ownerUID = "61589173862019";

      // ===== CONTACT =====
      const facebook = "https://www.facebook.com/profile.php?id=61589173862019";
      const whatsapp = "wa.me/01624783416";
      const telegram = "t.me/momineditor";
      const youtube = "https://www.youtube.com/@oa-py1ef";

      // ===== BOT INFO =====
      const botName = global.GoatBot?.config?.nickNameBot || "‎—͟͟͞͞★ 𝐒ᴇxʏ 𝐐ᴜᴇᴇɴ   ⸙  ❶❷:)>𝟑♡";
      const prefix = global.GoatBot?.config?.prefix || "/";
      const totalCommands = global.GoatBot?.commands?.size || 0;

      // ===== USERS & GROUPS =====
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      const totalUsers = allUsers.length;
      const totalGroups = allThreads.length;

      // ===== UPTIME =====
      const uptime = process.uptime();

      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // ===== TIME =====
      const now = moment().tz("Asia/Dhaka");
      const time = now.format("hh:mm:ss A");
      const date = now.format("DD/MM/YYYY");

      // ===== CACHE =====
      const cacheDir = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const videoPath = path.join(cacheDir, "owner.mp4");

      // ===== VIDEO URL =====
      const videoUrl = "https://files.catbox.moe/9c9wdz.mp4";

      // ===== DOWNLOAD VIDEO =====
      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(videoPath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // ===== MESSAGE =====
      const msg = `
╔═══✦══════════✦═══╗
║  🤖「 𝐎𝐖𝐍𝐄𝐑 𝐏𝐀𝐍𝐄𝐋 」🤖 ║         
╚═══✦══════════✦═══╝

┏━━━━━━━━━━━━━━━━━━┓
┃ 👑 𝙽𝙰𝙼𝙴: ${ownerName}
┃ 💎 𝙽𝙸𝙲𝙺: ${ownerNick}
┃ 🎂 𝙰𝙶𝙴: ${ownerAge}
┃ 📍 𝙵𝚁𝙾𝙼: ${ownerFrom}
┃ 🆔 𝚄𝙸𝙳: ${ownerUID}
┃ 🟢 𝙰𝙲𝚃𝙸𝚅𝙴「 24/7 」
┗━━━━━━━━━━━━━━━━━━┛

╭──── 📱 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙼𝙴 ────╮
│ 🌐 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺
│ └─ ${facebook}
│ 💬 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿
│ └─ ${whatsapp}
│ ✈️ 𝚃𝙴𝙻𝙴𝙶𝚁𝙰𝙼
│ └─ ${telegram}
│ ▶️ 𝚈𝙾𝚄𝚃𝚄𝙱𝙴
│ └─ ${youtube}
╰───────────────────╯

╭─── 🤖 𝙱𝙾𝚃 𝙳𝙴𝚃𝙰𝙸𝙻𝚂 ───╮
│ ⚡ 𝙽𝙰𝙼𝙴: ${botName}
│ ⏰ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeText}
│ 👥 𝚄𝚂𝙴𝚁𝚂:「 ${totalUsers} 」
│ 💬 𝙶𝚁𝙾𝚄𝙿𝚂:「 ${totalGroups} 」
│ 📦 𝙲𝙼𝙳𝚂:「 ${totalCommands} 」
│ 🔰 𝙿𝚁𝙴𝙵𝙸𝚇:「 ${prefix} 」
╰───────────────────╯

╭───── 📅 𝚃𝙸𝙼𝙴 ─────╮
│ 🗓️ 𝙳𝙰𝚃𝙴: ${date}
│ ⏰ 𝚃𝙸𝙼𝙴: ${time}
╰────────────────╯

╔═══✦══════════✦═══╗
║   💝 𝚃𝙷𝙰𝙽𝙺𝚂 𝙵𝙾𝚁 𝚄𝚂𝙸𝙽𝙶 💝  ║
╚═══✦══════════✦═══╝
`;

      await message.reply({
        body: msg,
        attachment: fs.createReadStream(videoPath)
      });

      // ===== DELETE VIDEO =====
      setTimeout(() => {
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }, 10000);

    } catch (err) {
      console.log(err);

      return message.reply("❌ | Owner command error.");
    }
  }
};
