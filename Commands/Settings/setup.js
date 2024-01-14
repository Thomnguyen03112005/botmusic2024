import { musicEmbedDefault } from "../../Handlers/functions.js";
import { commandBuilder } from "blackcat-djs";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilder({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["sums"], // lệnh phụ
  description: "thiết lập chế độ tự động phát trong channels", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const { musicBD } = client.database();
  let channel = message.mentions.channels.first();
  if (!channel) return message.reply({ content: "Bạn chưa đề cập đến channels nào cả" });
  const guildData = await musicBD.get(message.guild.id);
  if (!guildData) return;
  return channel.send(musicEmbedDefault(client, message.guild)).then(async (msg) => {
    // Cập nhật thuộc tính với giá trị mới
    guildData.ChannelId = channel.id;
    guildData.MessageId = msg.id;
    await musicBD.set(message.guild.id, guildData);
    return message.reply({ content: `Đã thiết lập thành công hệ thống âm nhạc ở ${channel.id}` });
  });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;