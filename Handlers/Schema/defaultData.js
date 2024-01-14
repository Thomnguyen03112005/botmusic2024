import mongoose from "mongoose";
// Định nghĩa schema cho Autoresume
const defaultDataSchema = new mongoose.Schema({
  GuildId: { 
    type: mongoose.Schema.Types.String,
    comment: "Lấy Id của Guilds mà bot tham gia",
  },
  GuildName: { 
    type: mongoose.Schema.Types.String,
    comment: "Lấy danh sách tên tất cả các guild mà bot tham gia",
  },
  Prefix: {
    type: mongoose.Schema.Types.String, 
    comment: "Prefix của guilds",
    default: ">",
  },
  MusicData: {
    DefaultAutoresume: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
      comment: "Bật tắt chế độ tự động phát cho bot trong guild",
    },
    DefaultAutoplay: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
      comment: " Bật hoặc tắt chế độ tự động phát bài hát tiếp theo",
    },
    DefaultVolume: {
      type: mongoose.Schema.Types.Number,
      default: 50,
      comment: "Mặc đị volume cho bot khi phát nhạc",
    },
    DefaultFilters: {
      type: mongoose.Schema.Types.Array,
      default: ["bassboost"],
      comment: "Bộ lọc mặc định khi phát nhạc dành cho guild"
    },
    MessageId: {
      type: mongoose.Schema.Types.String,
      comment: "Lấy id tin nhắn của kênh tự động phát"
    },
    ChannelId: {
      type: mongoose.Schema.Types.String,
      comment: "Lấy id kênh tự động phát nhạc"
    },
    Djroles: {
      type: mongoose.Schema.Types.Array,
      comment: "Thiết lập role yêu cầu phát nhạc"
    }
  }
});
// Tạo mô hình Mongoose từ schema
export default mongoose.model("defaultdata", defaultDataSchema);