const { EmbedBuilder } = require("discord.js")
const { prefix, color, kayıt } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {
     if (message.member.roles.cache.has(kayıt.yetkilirol)) {
          let user = message.mentions.members.first() || message.member;

          let bilgii = db.get(`yetkili_${user.user.id}`) || 0
          const embed = new EmbedBuilder()
               .setAuthor({ name: `${user.user.username}, kayıt bilgileri`, iconURL: user.user.avatarURL() })
               .setColor("Blurple")
               .setDescription(`Merhaba **${message.author.username}**, aşağıda belirttiğin kullanıcının kayıt bilgileri mevcuttur.`)
               .addFields([
                    { name: `Toplam Kayıt Sayısı`, value: `${bilgii}`, inline: true },
                    { name: `Bilgisini istediğiniz kullanıcı`, value: `${user}`, inline: true }
               ])
               .setFooter({ text: `Kayıt sistemi`, iconURL: message.author.avatarURL() })
               .setTimestamp()
          message.channel.send({ embeds: [embed] })
     }
}
exports.conf = {
     aliases: ["yetkilibilgi"]
}
exports.help = {
     name: "yetkili-bilgi"
}