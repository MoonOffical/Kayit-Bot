const { EmbedBuilder } = require("discord.js")
const { prefix, color, kayıt } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {

     if (message.member.roles.cache.has(kayıt.yetkilirol)) {
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member) return message.channel.send({ content: `<:hayir:1280530613471805505> | Geçerli bir kullanıcı etiketleyin!` })
          let yas = args.slice(1).join(" ") || "Bilinmiyor";
          if (!yas) {
               return message.channel.send({ content: `<:hayir:1280530613471805505> | Yaş bilgisini girin!` })
          }
          let isim = args[1];
          let yaş = args[2];
          let kayıtrol = message.guild.roles.cache.get(kayıt.kayıtrol)
          const kayıtedildiembed = new EmbedBuilder()
               .setColor("Blurple")
               .setAuthor({ name: `Kayıt yapıldı!`, iconURL: message.guild.iconURL() })
               .setDescription(`**${member} aramıza ${kayıtrol} rolleriyle katıldı.**`)
               .addFields([
                    { name: `Kaydı gerçekleştiren yetkili`, value: `> <@${message.author.id}>`, inline: true },
                    { name: `Aramıza hoş geldin`, value: `> ${member}`, inline: true }
               ])
               .setThumbnail(member.user.avatarURL())
               .setFooter({ text: `${member.user.username} aramıza katıldı.`, iconURL: member.user.avatarURL() })
               .setTimestamp()

          const kayıtembed = new EmbedBuilder()
               .setColor("Blurple")
               .setAuthor({ name: `${member.user.username}`, iconURL: member.user.avatarURL() })
               .setTitle("Kayıt Gerçekleştirildi")
               .setFooter({ text: `Kaydeden ${message.author.username}`, iconURL: message.author.iconURL() })
               .setDescription(`> ### **Kayıt Bilgileri**\n**Kayıt Edilen Kullanıcı: ${member}**\n**Kayıt Eden Kullanıcı: ${message.author}**\n**Verilen Roller:${kayıtrol}**\n**Yeni İsim: \`${isim} | ${yaş}\`\n**Kayıt Türü:** \`Normal Kayıt\``)
               .setTimestamp()
               .setThumbnail(message.guild.iconURL())


          member.setNickname(`${isim} | ${yaş || "18"}`, { reason: null })
          await message.channel.send({ embeds: [kayıtembed] })
          member.roles.add(kayıt.kayıtrol).catch(console.error);
          message.guild.channels.cache.get(kayıt.sohbetkanal).send({ embeds: [kayıtedildiembed] });
          let sıralama = db.get(`sıralama_${message.guild.id}`) || []
          if (!sıralama.some(e => e.includes(user.id))) {
               db.push(`sıralama_${message.guild.id}`, user.id)
          }
          let eskipuan = db.get(`yetkili_${message.author.id}`) || 0
          db.set(`yetkili_${message.author.id}`, eskipuan + 1)
          let eskisimler = db.get(`kullanıcıeskisimleri_${member.user.id}`) || []
          eskisimler.push(`${isim} | ${yaş}`)
          db.set(`kullanıcıeskisimleri_${member.user.id}`, eskisimler)
     }

}
exports.conf = {
     aliases: ["k", "kayit", "kaydet", "kayıt-et", "kayıtet"]
}
exports.help = {
     name: "kayıt"
}

/*  
               const embed = new EmbedBuilder()
               .setColor(color)
               .setAuthor({ name: `${member.user.username} (${member.id})`, iconURL: member.user.avatarURL() })
               .setTitle("Kayıt Yapıldı!")
               .setDescription(`**${member} aramıza ${kayıtrol} rolleriyle katıldı.**`)
               .addField("Kayıt Eden Yetkili", `<@${message.author.id}>`, true)
               .addField("Sunucuya Katılma Tarihi", `${message.channel.guild.name} (${new Date().toLocaleString()})`, true)
               .addField("Kullanıcı", `<@${member.id}>`, true)
               .addField("Yaş", yaş, true)
               */ 