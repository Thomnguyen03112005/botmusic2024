import { commandBuilder } from "blackcat-djs";
import { fileURLToPath } from "node:url";
import Discord from "discord.js";
import path from "node:path";

import PlaylistSchema from "../../Handlers/Schema/Playlist.js";
import { EmbedBuilders } from "../../Handlers/functions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilder({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["pl"], // lệnh phụ
  description: "Danh sách phát nhạc tự custom", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
	const commandName = args[0].toLowerCase();
  if(commandName === "create") {
		const playlist = await PlaylistSchema.findOne({ 
			userId: message.author.id
		});
		const createName = args.slice(1).join(" ");
		if(!playlist) {
			return await PlaylistSchema.create({
			  GuildId: message.guild.id,
				GuildName: message.guild.name,
				username: message.author.username,
			  userId: message.author.id,
				playlistName: "",
				createTime: ""
			});
		} else {
			if(playlist.playlistName.includes(createName)) {
			  return message.reply({ content: `Playlist có tên ${createName} đã được tạo trước đó.` });
		  } else {
		  	const currentTime = new Date().toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh"
        });
			  PlaylistSchema.findOneAndUpdate({ userId: message.author.id }, {
					$set: {
						playlistName: createName,
				    createTime: currentTime,  
					}
				}, { new: true }).then((result) => {
				  return message.reply({
					  embeds: [new EmbedBuilders({
						  title: { name: "Đã tạo playlist thành công" },
					  	timestamp: Date.now(),
					  	colors: "Random",
					  	fields: [
							  { name: "Id playlist", value: `${result._id}` },
							  { name: "Tên playlist", value: `${result.playlistName}` },
								{ name: "Playlist được tạo tại", value: `${result.GuildName}`},
							  { name: "Người tạo", value: `${result.username}` },
							  { name: "Tạo lúc", value: `${result.createTime}`}
						  ]
					  })]
				  });
			  }).catch(() => {
				  return message.reply({ content: "Đã có lỗi trong quá trình tạo playlist vui lòng thử lại sau" });
			  });
		  };
		};
	} else if(commandName === "info") {
		return await PlaylistSchema.findOne({ _id: args[1] }).then((playlist) => {
			let privacy;
      if(playlist.privacy === Boolean(true)) {
        privacy = "Riêng tư";
      } else privacy = "Công cộng";
			const embeds = new EmbedBuilders({
				title: { name: "__Thông tin của Playlist__" },
				timestamp: Date.now(),
				colors: "Random",
				fields: [
					{ name: "Id playlist", value: `${playlist._id}` },
					{ name: "Tên playlist", value: `${playlist.playlistName}` },
					{ name: "Trạng thái", value: `${privacy}` },
					{ name: "Playlist được tạo tại", value: `${playlist.GuildName}`},
					{ name: "Người tạo", value: `${message.guild.members.cache.get(playlist.userId)} - (${playlist.username})` },
					{ name: "Tạo lúc", value: `${playlist.createTime}`},
				],
			});
			playlist.songs.name.map((song, index) => {
        embeds.addFields({ 
					name: "**Bài hát trong danh sách**",
					value: `${[`**${index + 1}.** [${song}](${playlist.songs.url[index]})`].join('\n') || "Không có bài hát nào trong playlist"}`
				});
      }).join('\n');
			return message.reply({ embeds: [embeds] });
		}).catch((e) => {
			console.log(e);
			return message.reply({ content: `Không có playlist nào trùng với id mà bạn đã cung cấp, bạn có thể tạo 1 playlist mới bằng cách \`${prefix}playlist create <tên playlist>\`` });
		});
	} else if(commandName === "deleted") {
		return await PlaylistSchema.findOne({ _id: args[1] }).then(async(playlist) => {
			if(playlist.userId !== message.author.id) return message.reply({
        content: "Bạn chỉ có thể xóa danh sách phát của riêng mình"
      });
			await PlaylistSchema.deleteOne({ _id: playlist._id });
			return message.reply({
				embeds: [new EmbedBuilders({
					title: { name: "__Đã xoá thành công Playlist__" },
					description: `Playlist có id \`${playlist._id}\` đã được xoá thành công`,
					colors: "Random",
					timestamp: Date.now(),
				})]
			});
		}).catch((e) => {
			return message.reply({ content: "Không có playlist nào trùng với id mà bạn đã cung cấp" });
		});
	} else if(commandName === "add") {
		return await PlaylistSchema.findOne({ _id: args[1] }).then(async(playlist) => {
			const song = args.slice(2).join(" ");
			if(playlist.userId !== message.author.id) return message.reply({ 
        content: "Bạn chỉ có thể thêm các bài hát vào danh sách phát của riêng mình"
      });
			const songData = await client.distube.search(song, { limit: 1 }).catch(() => {
				interaction.reply({ content: 'Không tìm thấy bài hát nào.' });
			});
			const url = songData[0].url;
      const name = songData[0].name;
			if(playlist.songs.url.includes(url)) return message.reply({ 
        content: "Bài hát này đã có trong danh sách phát"
      });
			playlist.songs.url.push(url);
      playlist.songs.name.push(name);
			await playlist.save();
			return message.reply({
				embeds: [new EmbedBuilders({
					title: { name: "__Đã thêm bài hát vào playlist thành công__" },
					colors: "Random",
					timestamp: Date().now,
					description: `✅ | Đã thêm thành công **[${name}](${url})** vào Danh sách phát`
				})]
			});
		}).catch((e) => {
			console.log(e);
			return message.reply({ content: "Không có playlist nào trùng với id mà bạn đã cung cấp" });
		});
	} else if(commandName === "list") {
		const optionPlaylist = args[1];
	  if(optionPlaylist === "public") {
			const data = await PlaylistSchema.find({ private: false });
      if(!data.length) return message.reply({
        content: "Không có danh sách phát nào được công khai."
      });
			const embeds = new EmbedBuilders({
				thumbnail: message.guild.iconURL({ dynamic: true }),
				title: { name: "📃 | __Danh sách playlist cộng đồng__" },
				colors: "Random",
				timestamp: Date.now(),
			});
			data.map((queue, index) => {
        embeds.addFields([ 
					{ 
						name: `**${index + 1}.** ${queue.playlistName.toUpperCase()}`, 
						value: `id: ${queue._id}`
					} 
				]);
      }).join("\n");
			return message.reply({ embeds: [embeds] });
		} else if(optionPlaylist === "private") {
			const data = await PlaylistSchema.find({ private: true });
      if(!data.length) return message.reply({
        content: "Không có danh sách phát riêng tư nào."
      });
			const embeds = new EmbedBuilders({
				thumbnail: message.guild.iconURL({ dynamic: true }),
				title: { name: "📃 | __Danh sách playlist riêng tư nào__" },
				colors: "Random",
				timestamp: Date.now(),
			});
			data.map((queue, index) => {
        embeds.addFields([ 
					{ 
						name: `**${index + 1}.** ${queue.playlistName.toUpperCase()}`, 
						value: `id: ${queue._id}`
					} 
				]);
      }).join("\n");
			return message.reply({ embeds: [embeds] });
		};
	} else if(commandName === "play") {
		// 
	};
	
	if(commandName === "help" || commandName === "cmd") {
		const cmdList = [
			{ name: "create", description: "Tạo danh sách phát mới cho database" }, 
			{ name: "info", description: "Hiển thị thông tin playlist" }
		];
		const embeds = new EmbedBuilders({
			title: { name: "__Danh sách lệnh của playlist__" },
			description: `Cách sử dụng lệnh:\n\`${prefix}playlist <Tên lệnh>\``,
			colors: "Random",
			timestamp: Date.now(),
		});
	  cmdList.forEach((cmd, index) => embeds.addFields({ name: `${index + 1}. ${cmd.name}`, value: cmd.description }));
    return message.reply({ embeds: [embeds] });
	};
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;