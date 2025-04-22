const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js')

exports.run = async (client, message, args) => {

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} - Ping`, iconURL: `${client.user.avatarURL()}` })
        .setTitle("Ping")
        .setDescription(`Pingim: \`${client.ws.ping}ms\``)
        .setColor("Blurple")
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() })
    message.channel.send({ embeds: [embed] })
}
exports.conf = {
    aliases: ["pong"],
};

exports.help = {
    name: 'ping',
    description: 'Botun Pingini Gösterir.',
};