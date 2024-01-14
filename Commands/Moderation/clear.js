import { commandBuilder } from "blackcat-djs";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilder({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["cl"], // lệnh phụ
  description: "Xoá message theo yêu cầu", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: ["ManageMessages"] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  // Lấy số lượng tin nhắn cần xóa từ đối số của lệnh
  const amount = parseInt(args[0]);
  // Kiểm tra xem đối số có là một số hợp lệ hay không
  if (isNaN(amount)) return message.reply({ content: 'Vui lòng nhập một số hợp lệ.' });
  // Xoá tin nhắn
  message.channel.bulkDelete(amount).then(() => {
    message.reply({ content: `Đã xoá ${amount} tin nhắn.` });
  }).catch((error) => {
    console.error('Lỗi khi xoá tin nhắn:', error);
    message.reply({ content: 'Đã xảy ra lỗi khi xoá tin nhắn.' });
  });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;