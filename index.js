import { Client as BlackCatClient } from "blackcat-djs";
import Discord from "discord.js";
import mongoose from "mongoose";
import colors from "chalk";

import dataModel from "./Handlers/Schema/defaultData.js";

class Client extends BlackCatClient {
  constructor() {
    super({ 
      discordClient: {
        allowedMentions: {
          parse: ["roles", "users", "everyone"],
          repliedUser: false,
        },
        partials: [
          Discord.Partials.User,
          Discord.Partials.Message,
          Discord.Partials.Reaction
        ], //Object.keys(Discord.Partials), // get tất cả sự kiện mà partials
        intents: [
          Discord.GatewayIntentBits.Guilds,
          Discord.GatewayIntentBits.GuildMessages,
          Discord.GatewayIntentBits.MessageContent,
          Discord.GatewayIntentBits.GuildInvites,
          Discord.GatewayIntentBits.GuildMembers,
          Discord.GatewayIntentBits.GuildPresences,
          Discord.GatewayIntentBits.GuildMessageReactions,
          Discord.GatewayIntentBits.GuildVoiceStates
        ], // Object.keys(Discord.GatewayIntentBits), // lấy tất cả sự kiện mà Discord.GatewayIntentBits có
      },
      // config.json
      config: {
        tokenBot: process.env.token || "token bot",
        prefix: process.env.prefix || "!!",
        developer: process.env.developer || "788208207465938954",
        mongourl: process.env.mongourl || "mongodb+srv://BlackCat-Club:blackcat2k3@blackcat-club.sfgyw.mongodb.net/BlackCat-Discord",
        clientId: "fc0d728b397c4f8398d2a13345c6d47c",
        youtubeCookie: "VISITOR_INFO1_LIVE=KAnwPD-vmGE; SID=GQjPfJXVkW63JHdicSKmT7jbzh-rAOS21sbAsa3tsteMoA44OMykWx9Qwr_dIcBhRxjRjg.; __Secure-1PSID=GQjPfJXVkW63JHdicSKmT7jbzh-rAOS21sbAsa3tsteMoA44pYGTKv1KrWPlvs9xxPQ41g.; __Secure-3PSID=GQjPfJXVkW63JHdicSKmT7jbzh-rAOS21sbAsa3tsteMoA44Z4qDi8CFg8WW2a3kcmbMYg.; HSID=Azu4HJa3AIG0PC2SL; SSID=AxCDXBMAGZoY13kvP; APISID=KwWgVTNlitJzn9UQ/A0lr9IhyijPgPW6Ha; SAPISID=9I3XSSvUyxZH4vHf/AOjIyZKuW8ZGgq-1s; __Secure-1PAPISID=9I3XSSvUyxZH4vHf/AOjIyZKuW8ZGgq-1s; __Secure-3PAPISID=9I3XSSvUyxZH4vHf/AOjIyZKuW8ZGgq-1s; YSC=qfXIawav8Hk; LOGIN_INFO=AFmmF2swRgIhAM3-5bd0gVsZ544PemCs1lHbAImxGsSm8COAnk5eLA83AiEA97NSeJZwOehvW2WA9AM8Tt1rB-YmzwYp4xbtlCmR3Hk:QUQ3MjNmeGVjcTV3QVhGS05PYmFRSWZwdXZlMS1DNU9RSW53Zm5JZDBjaTBxdjJnanV4dmR3UGJWeWVPNHJlUndCS3gzczdRQXVWdFRtRWlkaER6MFdLZEJlTHh5ZFZMaWpreGFWQVpjVEs2TTdZemtaRGM4eHVpeFd2c3lrbUhrTDRKNG5FWU9LU3BFZ0QyQkNhUktOQzhiZWJlSDY5a2hR; PREF=tz=Asia.Bangkok&f6=400; SIDCC=AJi4QfE3mhs3Iwk0sITqhGMHmYE3Y25SIBjIbA2ph0C1tA5uoi-kIUvkM962NBXAz23ShYwgbA; __Secure-3PSIDCC=AJi4QfEMsvf7I1nYqRXINYYCVQQaOc1D1N_lIyxKzVgmScwoqWnMHEimjWvMm-MLZPzN6Ywx",
      },
      // bảng điêù khiển tùy chỉnh lệnh
      commandHandler: {
        prefixCommand: true, // bật hoặc tắt lệnh đang chạy với prefix
        slashCommand: true, // bật hoặc tắt lệnh slash
        setLanguage: "vi", // ngôn ngữ tùy chỉnh của gói. Hiện tại chỉ hỗ trợ 2 ngôn ngữ: vi: Tiếng Việt và en: Tiếng Anh
        path: {
          prefixCommand: "./Commands", // path to prefix commands
          slashCommand: "./slashCommands", // path to slash commands
        },
      },
    });
    this.maps = new Map();
    // xem bot đã onl hay chưa
    this.on(Discord.Events.ClientReady, async (bot) => {
      console.log(colors.yellow(bot.user.username + " đã sẵn sàng hoạt động"));
      mongoose.connect(this.config.mongourl).then(() => {
        console.log(colors.blue("Đã kết nối đến mongoose thành công."));
      }).catch(() => {
        console.log(colors.red("Kết nối đến mongoose không thành công."));
      });
      this.guilds.cache.forEach(async (guild) => {
        const checkGuild = await dataModel.findOne({ GuildId: guild.id });
        if(!checkGuild) return dataModel.create({
          GuildId: guild.id,
          GuildName: guild.name
        });
        if(checkGuild) return;
      });
    });
  };
  async handlerFolder(commands) {
    return Promise.all(commands.map((files) => import(`./Handlers/${files}.js`))).then((modules) => {
      modules.forEach((command) => command.default(this));
    }).catch((error) => console.error('Lỗi nhập mô-đun:', error));
  };
};

const build = new Client();

build.handlerFolder(["distube", "economy", "giveaways"]);