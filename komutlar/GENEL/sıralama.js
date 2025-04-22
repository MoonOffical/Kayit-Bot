const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("croxydb");
const ayarlar = require("../../ayarlar");

exports.run = async (client, message, args) => {
     let roleID = ayarlar.kayıt.yetkilirol;
     let members = message.guild.members.cache.filter(m => m.roles.cache.has(roleID));

     let yetkililer = members.map(m => ({
          id: m.user.id,
          puan: db.get(`yetkili_${m.user.id}`) || 0
     }));

     yetkililer.sort((a, b) => b.puan - a.puan);

     let page = 0;
     let perPage = 9;
     let maxPage = Math.ceil(yetkililer.length / perPage);

     function generateEmbed(page) {
          let start = page * perPage;
          let end = start + perPage;
          let list = yetkililer.slice(start, end);

          let embed = new EmbedBuilder()
               .setAuthor({ name: `${message.author.username}`, iconURL: message.author.avatarURL() })
               .setTitle("Yetkili Sıralaması")
               .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })
               .setTimestamp()
               .setThumbnail(message.guild.iconURL())
               .setColor("Blurple");

          if (list.length === 0) {
               embed.setDescription("Bu sayfada gösterilecek yetkili bulunamadı.");
          } else {
               list.forEach((u, i) => {
                    embed.addFields({ name: `#${start + i + 1} ${client.users.cache.get(u.id).username}`, value: `Kayıt Sayısı: ${u.puan}`, inline: true });
               });
          }

          return embed;
     }

     let row = new ActionRowBuilder()
          .addComponents(
               new ButtonBuilder()
                    .setCustomId("prev_page")
                    .setLabel("⬅️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),
               new ButtonBuilder()
                    .setCustomId("next_page")
                    .setLabel("➡️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page >= maxPage - 1)
          );

     let msg = await message.channel.send({ embeds: [generateEmbed(page)], components: [row] });

     const collector = msg.createMessageComponentCollector({ time: 60000 });

     collector.on("collect", async i => {
          if (i.user.id !== message.author.id) return i.reply({ content: "Bu butonları sadece komutu kullanan kişi kullanabilir!", ephemeral: true });

          if (i.customId === "prev_page" && page > 0) page--;
          if (i.customId === "next_page" && page < maxPage - 1) page++;

          let newRow = new ActionRowBuilder()
               .addComponents(
                    new ButtonBuilder()
                         .setCustomId("prev_page")
                         .setLabel("⬅️")
                         .setStyle(ButtonStyle.Primary)
                         .setDisabled(page === 0),
                    new ButtonBuilder()
                         .setCustomId("next_page")
                         .setLabel("➡️")
                         .setStyle(ButtonStyle.Primary)
                         .setDisabled(page >= maxPage - 1)
               );

          await i.update({ embeds: [generateEmbed(page)], components: [newRow] });
     });

     collector.on("end", () => {
          msg.edit({ components: [] }).catch(() => { });
     });
};

exports.conf = {
     aliases: ["yetkilisıralama", "yetkili-sıralama"]
};

exports.help = {
     name: "sıralama"
};
