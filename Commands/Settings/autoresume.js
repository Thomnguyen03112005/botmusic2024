import { commandBuilder } from "blackcat-djs";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilder({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["resu"], // lệnh phụ
  description: "bật hoặc tắt chế độ tự động phát lại nhạc khi bot bị ngắt kết nối", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: ["Administrator"] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const { musicBD } = client.database();
  const data = await musicBD.get(message.guild.id);
  if (!data) return;
  data.DefaultAutoresume = Boolean(args[0]);
  await musicBD.set(message.guild.id, data);

  return message.reply({
    content: "Đã thiết lập thành công"
  });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;