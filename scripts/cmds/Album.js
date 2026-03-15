const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "album",
    aliases: ["album"],
    version: "1.1",
    author: "Saimx69x",
    countDown: 2,
    role: 0,
    description: "Reply with a number to get a video, or reply to a video with /animealbum add <category>",
    category: "media"
  },

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: FARHAN BOT
 * 👤 OWNER: FARHAN KHAN 
 * 🔗 FACEBOOK: https://www.facebook.com/DARK.XAIKO.420
 * 🛠️ PROJECT: FARHAN BOT PROJECT (2026)
 * --------------------------------------- */

  onStart: async function ({ message, event, args }) {
    try {
      const apiJsonUrl = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";
      const apiRes = await axios.get(apiJsonUrl);
      const baseUrl = apiRes.data.apiv1;

      // ---- ADD VIDEO LOGIC ----
      if (args[0]?.toLowerCase() === "add") {
        const category = args[1]?.toLowerCase();
        if (!category) {
          return message.reply("❌ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 𝐢𝐬 𝐫𝐞𝐪𝐮𝐢𝐫𝐞𝐝!\n✨ 𝐔𝐬𝐚𝐠𝐞: /𝐚𝐧𝐢𝐦𝐞𝐚𝐥𝐛𝐮𝐦 𝐚𝐝𝐝 <𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲>");
        }
        if (!event.messageReply || !event.messageReply.attachments?.length) {
          return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐯𝐢𝐝𝐞𝐨 𝐭𝐨 𝐚𝐝𝐝 𝐢𝐭.");
        }

        const attachment = event.messageReply.attachments[0];
        if (!attachment.type.includes("video")) {
          return message.reply("❌ 𝐓𝐡𝐞 𝐫𝐞𝐩𝐥𝐢𝐞𝐝 𝐟𝐢𝐥𝐞 𝐢𝐬 𝐧𝐨𝐭 𝐚 𝐯𝐢𝐝𝐞𝐨.");
        }

        const videoUrl = attachment.url;
        const cachePath = path.join(process.cwd(), "cache");
        if (!fs.existsSync(cachePath)) fs.ensureDirSync(cachePath);
        const videoFilePath = path.join(cachePath, `temp_${Date.now()}.mp4`);

        const videoResp = await axios.get(videoUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(videoFilePath);
        videoResp.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(videoFilePath));

        const catboxResp = await axios.post("https://catbox.moe/user/api.php", form, {
          headers: form.getHeaders(),
        });

        if (fs.existsSync(videoFilePath)) fs.unlinkSync(videoFilePath);
        const catboxUrl = catboxResp.data.trim();

        const apiURL = `${baseUrl}/api/albumadd?category=${encodeURIComponent(category)}&url=${encodeURIComponent(catboxUrl)}`;
        const apiResp2 = await axios.get(apiURL);
        
        return message.reply(`${apiResp2.data.message}\n🔗 ${apiResp2.data.url}`);
      }

      // ---- LIST ALBUM LOGIC ----
      const listUrl = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/anialbumcategory.json";
      const res = await axios.get(listUrl);
      const displayNames = res.data.display;
      const realCategories = res.data.real;

      const itemsPerPage = 10;
      const page = parseInt(args[0]) || 1;
      const totalPages = Math.ceil(displayNames.length / itemsPerPage);

      if (page < 1 || page > totalPages) {
        return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐩𝐚𝐠𝐞! (1-${totalPages})`);
      }

      const startIndex = (page - 1) * itemsPerPage;
      const categoriesToShow = displayNames.slice(startIndex, startIndex + itemsPerPage);

      let text = "🎥 𝐀𝐍𝐈𝐌𝐄 𝐀𝐋𝐁𝐔𝐌 𝐕𝐈𝐃𝐄𝐎𝐒\n━━━━━━━━━━━━━━━━━\n";
      categoriesToShow.forEach((cat, i) => {
        text += `│⌯ ${startIndex + i + 1}. ${cat}\n`;
      });
      text += `━━━━━━━━━━━━━━━━━\n📄 𝐏𝐚𝐠𝐞: ${page}/${totalPages}\n🎯 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫`;

      const sent = await message.reply(text);
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        startIndex,
        endIndex: startIndex + itemsPerPage,
        displayNames,
        realCategories,
        listMsgID: sent.messageID,
        baseUrl
      });
    } catch (e) {
      console.error(e);
      return message.reply("⚠️ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝.");
    }
  },

  onReply: async function ({ message, Reply, event }) {
    if (event.senderID !== Reply.author) return;
    const num = parseInt(event.body.trim());
    const index = num - 1;

    if (isNaN(num) || index < Reply.startIndex || index >= Reply.endIndex) {
      return message.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.");
    }

    try {
      message.unsend(Reply.listMsgID).catch(() => {});
      const category = Reply.realCategories[index];
      const link = `${Reply.baseUrl}/api/album?category=${category}`;
      const res = await axios.get(link);

      if (!res.data?.url) return message.reply("⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐯𝐢𝐝𝐞𝐨.");

      await message.reply({
        body: `🎬 𝐘𝐎𝐔𝐑 𝐕𝐈𝐃𝐄𝐎 𝐈𝐒 𝐑𝐄𝐀𝐃𝐘!\n📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 ➤ ${Reply.displayNames[index]}\n✨ 𝐄𝐧𝐣𝐨𝐲!`,
        attachment: await global.utils.getStreamFromURL(res.data.url)
      });
    } catch (e) {
      return message.reply("❌ 𝐄𝐫𝐫𝐨𝐫 𝐰𝐡𝐢𝐥𝐞 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨.");
    }
  }
};
