import mongoose from "mongoose";
// Định nghĩa schema cho Autoresume
const autoresumeSchema = new mongoose.Schema({
  // Id của guild, bắt buộc và duy nhất
  guildId: { type: String, required: true, comment: "Id của guild, là một trường duy nhất và bắt buộc" },
  // Id của kênh giọng nói
  voiceChannel: { type: String, comment: "Id của kênh giọng nói được lưu trữ trong autoresume" },
  // Id của kênh văn bản
  textChannel: { type: String, comment: "Id của kênh văn bản được lưu trữ trong autoresume" },
  // Danh sách các bài hát trong autoresume
  songs: [
    {
      url: { type: String, comment: "Đường dẫn của bài hát" },
      memberId: { type: String, comment: "Id của thành viên liên quan đến bài hát" },
      duration: { type: Number, comment: "Thời lượng của bài hát" },
      formattedDuration: { type: String, comment: "Thời lượng được định dạng của bài hát" },
      id: { type: String, comment: "Id của bài hát" },
      isLive: { type: Boolean, comment: "Bài hát có đang được phát trực tiếp hay không" },
      name: { type: String, comment: "Tên của bài hát" },
      thumbnail: { type: String, comment: "Đường link ảnh đại diện cho bài hát" },
      type: { type: String, comment: "Loại của bài hát, ví dụ: video, audio" },
      uploader: { 
        name: { type: String, comment: "Người tải lên bài hát" },
        url: { type: String, comment: "Url người tải lên bài hát" }
      },
      views: { type: Number, comment: "Số lượt xem của bài hát" },
      source: { type: String, comment: "Nguồn cung cấp bài hát" },
    },
  ],
  // Danh sách bộ lọc âm nhạc
  filters: [{ type: Array, comment: "Danh sách các bộ lọc âm nhạc được áp dụng" }],
  // Chế độ lặp lại
  repeatMode: { type: Number, comment: "Chế độ lặp lại của autoresume" },
  // Tự động phát tiếp theo
  autoplay: { type: Boolean, comment: "Tự động phát tiếp theo hay không" },
  // Cấp độ âm lượng
  volume: { type: Number, comment: "Cấp độ âm lượng của autoresume" },
  // Thời điểm hiện tại trong bài hát
  currentTime: { type: Number, comment: "Thời điểm hiện tại của bài hát đang được phát" },
});
// Tạo mô hình Mongoose từ schema
const AutoresumeModel = mongoose.model("Autoresume", autoresumeSchema);
// xuất module
export default AutoresumeModel;