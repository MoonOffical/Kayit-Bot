const { EmbedBuilder } = require("discord.js")
const { prefix, color, kayıt } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {

     if (message.member.roles.cache.has(kayıt.yetkilirol)) {
          let user = message.mentions.members.first()
          let bilgii = db.get(`kullanıcıeskisimleri_${user.user.id}`)
          const embed = new EmbedBuilder()
               .setAuthor({ name: `${user.user.username}, kayıt bilgileri`, iconURL: user.user.avatarURL() })
               .setColor("Blurple")
               .setDescription(`Merhaba, **${message.author.username}** aşağıda belirttiğin kullanıcının kayıt bilgilerini görebilirsin.`)
               .addFields([
                    { name: `Önceden kayıt olduğu isimler`, value: `${bilgii.map(e => e).join("\n") || "Daha önceden kayıt olmamış."}`, inline: true },
                    { name: `Bilgisini istediğin kullanıcı`, value: `> ${user}`, inline: true }
               ])
               .setFooter({ text: `Kayıt Sistemi`, iconURL: message.author.avatarURL() })
               .setTimestamp()
          message.channel.send({ embeds: [embed] })
     }
}
exports.conf = {
     aliases: ["kayıtbilgi"]
}
exports.help = {
     name: "kayıt-bilgi"
}