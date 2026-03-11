const axios = require("axios");
const fs = require("fs");
const path = require("path");

const aryan = "https://nix-album-api.vercel.app";
const nix = "https://apis-toop.vercel.app/aryan/imgur";

module.exports = {
  config: {
    name: "album",
    version: "0.0.1",
    role: 0,
    author: "ArYAN",
    countDown: 5,
    category: "media",
    description: "Watch videos by category",
    guide: {
      en: "{p}{n} [page] - View list\n{p}{n} add [category] [URL] - Add video\n{p}{n} list - View categories",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // --- ADD VIDEO LOGIC ---
    if (args[0] === "add") {
      const category = args[1]?.toLowerCase();
      let videoUrl = args[2];

      if (!category) return api.sendMessage("[⚜️] Usage: !album add [category] [url/reply]", threadID, messageID);

      if (event.messageReply?.attachments?.length > 0) {
        if (event.messageReply.attachments[0].type !== "video") return api.sendMessage("[⚜️] Only videos allowed!", threadID, messageID);
        videoUrl = event.messageReply.attachments[0].url;
      }

      if (!videoUrl) return api.sendMessage("[⚜️] Provide a video URL!", threadID, messageID);

      try {
        const imgurRes = await axios.get(nix, { params: { url: videoUrl } });
        const imgurLink = imgurRes.data.imgur;
        const addRes = await axios.post(`${aryan}/api/album/add`, { category, videoUrl: imgurLink });
        return api.sendMessage(addRes.data.message, threadID, messageID);
      } catch (e) {
        return api.sendMessage("[⚜️] Failed to add video.", threadID, messageID);
      }
    }

    // --- LIST CATEGORIES FROM API ---
    if (args[0] === "list") {
      try {
        const res = await axios.get(`${aryan}/api/category/list`);
        if (res.data.success) {
          return api.sendMessage(`𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬:\n\n${res.data.categories.join("\n")}`, threadID, messageID);
        }
      } catch (e) {
        return api.sendMessage("[⚜️] API Error!", threadID, messageID);
      }
    }

    // --- MAIN LIST DISPLAY ---
    const categoriesInJson = ["funny", "islamic", "sad", "anime", "lofi", "attitude", "ff", "love", "horny", "baby", "romantic", "cartoon", "pubg", "emotional", "meme", "song", "friend", "trending", "hinata", "gojo", "car", "cat", "random", "game", "asif", "azhari", "girl", "travel", "food", "nature", "tiktok", "naruto", "phone", "editing", "neymar", "messi", "ronaldo", "football", "hindi", "18+"];
    const displayNames = ["𝐅𝐮н𝐧𝐲", "𝐈𝐬𝐥𝐚𝐦𝐢𝐜", "𝐒𝐚𝐝", "𝐀𝐧𝐢𝐦𝐞", "𝐋𝐨𝐅𝐈", "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞", "𝐅𝐟", "𝐋𝐨𝐯𝐞", "𝐇𝐨𝐫𝐧𝐲", "𝐁𝐚𝐛𝐲", "𝐑𝐨𝐦𝐚𝐧𝐭𝐢𝐜", "𝐂𝐚𝐫𝐭𝐨𝐨𝐧", "𝐏𝐮𝐛𝐠", "𝐄𝐦𝐨𝐭𝐢𝐨𝐧𝐚𝐥", "𝐌𝐞𝐦𝐞", "𝐒𝐨𝐧𝐠", "𝐅𝐫𝐢𝐞𝐧𝐝", "𝐓𝐫𝐞𝐧𝐝𝐢𝐧𝐠", "𝐇𝐢𝐧𝐚𝐭𝐚", "𝐆𝐨𝐣𝐨", "𝐂𝐚𝐫", "𝐂𝐚𝐭", "𝐑𝐚𝐧𝐝𝐨𝐦", "𝐆𝐚𝐦𝐞", "𝐀𝐬𝐢𝐟", "𝐀𝐳𝐡𝐚𝐫𝐢", "𝐆𝐢𝐫𝐥", "𝐓𝐫𝐚𝐯𝐞𝐥", "𝐅𝐨𝐨𝐝", "𝐍𝐚𝐭𝐮𝐫𝐞", "𝐓𝐢𝐤𝐭𝐨𝐤", "𝐍𝐚𝐫𝐮𝐭𝐨", "𝐏𝐡𝐨𝐧𝐞", "𝐄𝐝𝐢𝐭𝐢𝐧𝐠", "𝐍𝐞𝐲𝐦𝐚𝐫", "𝐌𝐞𝐬𝐬𝐢", "𝐑𝐨𝐧𝐚𝐥𝐝𝐨", "𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥", "𝐇𝐢𝐧𝐝𝐢", "𝟏𝟖+"];
    const captions = ["𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 <😺", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 <✨", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 <😢", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 <🌟", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨 <🎶", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨 <☠️", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐟 𝐕𝐢𝐝𝐞𝐨 <🎮", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨 <💖", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 <🥵", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐁𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨 <🥰", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐑𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 <😍", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐂𝐚𝐫𝐭𝐨𝐨𝐧 𝐕𝐢𝐝𝐞𝐨 <🙅", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐏𝐮𝐛𝐠 𝐕𝐢𝐝𝐞𝐨 <🎮", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐄𝐦𝐨𝐭𝐢𝐨𝐧𝐚𝐥 𝐕𝐢𝐝𝐞𝐨 <😌", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐌𝐞𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 <🐥", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐒𝐨𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 <🎧", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐫𝐢𝐞𝐧𝐝 𝐕𝐢𝐝𝐞𝐨 <👭", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐓𝐫𝐞𝐧𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 <🎯", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐇𝐢𝐧𝐚𝐭𝐚 𝐕𝐢𝐝𝐞𝐨 <🧑‍🦰", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐆𝐨𝐣𝐨 𝐕𝐢𝐝𝐞𝐨 <🧔", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐂𝐚𝐫 𝐕𝐢𝐝𝐞𝐨 <🚗", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 <🐈", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐑𝐚𝐧𝐝𝐨𝐦 𝐕𝐢𝐝𝐞𝐨 <🌎", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐆𝐚𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 <🎮", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐬𝐢𝐟 𝐕𝐢𝐝𝐞𝐨 <🧑‍🚀", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐳𝐡𝐚𝐫𝐢 𝐕𝐢𝐝𝐞𝐨 <👳", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐆𝐢𝐫𝐥 𝐕𝐢𝐝𝐞𝐨 <💃", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐓𝐫𝐚𝐯𝐞𝐥 𝐕𝐢𝐝𝐞𝐨 <👌", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐨𝐨𝐝 𝐕𝐢𝐝𝐞𝐨 <🍔", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐍𝐚𝐭𝐮𝐫𝐞 𝐕𝐢𝐝𝐞𝐨 <❤️", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐓𝐢𝐤𝐭𝐨𝐤 𝐕𝐢𝐝𝐞𝐨 <💥", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐍𝐚𝐫𝐮𝐭𝐨 𝐕𝐢𝐝𝐞𝐨 <🙋", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐏𝐡𝐨𝐧𝐞 𝐕𝐢𝐝𝐞𝐨 <📱", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐄𝐝𝐢𝐭𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 <💻", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐍𝐞𝐲𝐦𝐚𝐫 𝐕𝐢𝐝𝐞𝐨 <⚽", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐌𝐞𝐬𝐬𝐢 𝐕𝐢𝐝𝐞𝐨 <⚽", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐕𝐢𝐝𝐞𝐨 <⚽", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 <⚽", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐇𝐢𝐧𝐝𝐢 𝐕𝐢𝐝𝐞𝐨 <🫂", "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝟏𝟖+ 𝐕𝐢𝐝𝐞𝐨 <🔥"];

    const itemsPerPage = 10;
    const page = parseInt(args[0]) || 1;
    const totalPages = Math.ceil(displayNames.length / itemsPerPage);

    if (page < 1 || page > totalPages) return api.sendMessage(`[⚜️] Invalid page! 1 - ${totalPages}`, threadID, messageID);

    const startIndex = (page - 1) * itemsPerPage;
    const displayed = displayNames.slice(startIndex, startIndex + itemsPerPage);

    let msg = "𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨 𝐋𝐢𝐬𝐭 🎀\n𐙚━━━━━━━━━━━━━━━━━ᡣ𐭩\n";
    displayed.forEach((name, i) => { msg += `${startIndex + i + 1}. ${name} 𝐕𝐢𝐝𝐞𝐨\n`; });
    msg += `𐙚━━━━━━━━━━━━━━━━━ᡣ𐭩\n♻ | 𝐏𝐚𝐠𝐞 [${page}/${totalPages}]\nℹ | 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐧𝐮𝐦𝐛𝐞𝐫 𝐨𝐫 !album ${page + 1}`;

    return api.sendMessage(msg, threadID, (err, info) => {
      if (global.GoatBot?.onReply) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          realCategories: categoriesInJson,
          captions: captions
        });
      }
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, body } = event;
    const index = parseInt(body) - 1;

    if (isNaN(body) || index < 0 || index >= Reply.realCategories.length) {
      return api.sendMessage("Invalid number!", threadID, messageID);
    }

    api.unsendMessage(Reply.messageID);
    const category = Reply.realCategories[index];
    const caption = Reply.captions[index];

    try {
      const res = await axios.get(`${aryan}/api/album/videos/${category}`);
      const videos = res.data.videos;

      if (!videos || videos.length === 0) return api.sendMessage("No videos in this category!", threadID, messageID);

      const randomUrl = videos[Math.floor(Math.random() * videos.length)];
      const filePath = path.join(__dirname, `tmp_${Date.now()}.mp4`);

      const vidRes = await axios({ url: randomUrl, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      vidRes.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({ body: caption, attachment: fs.createReadStream(filePath) }, threadID, () => fs.unlinkSync(filePath), messageID);
      });
    } catch (e) {
      return api.sendMessage("Failed to fetch/send video.", threadID, messageID);
    }
  }
};
