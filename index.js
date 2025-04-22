const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.js");
const { prefix, color } = require("./ayarlar.js")
const db = require("croxydb")
const Discord = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

module.exports = client;

const { error } = require("console");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        cmd.run(client, message, params)
    }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

    client.user.setPresence({ activities: [{ name: 'Code World.' }] });


    console.log('_________________________________________');
    console.log(`Bot Adı     : ${client.user.username}`);
    console.log(`Prefix             : ${ayarlar.prefix}`);
    console.log(`Durum              : Bot Çevrimiçi!`);
    console.log('_________________________________________');
});

fs.readdir("./komutlar/GENEL", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/GENEL/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });

})

////////////////////////////////////////// MAİN COMMANDS /////////////////////////////////////////

client.on("guildMemberAdd", async member => {
    let kayıtkanal = member.guild.channels.cache.get(ayarlar.kayıt.kayıtkanal)

    if (kayıtkanal) {
        let kayıtyt = member.guild.roles.cache.get(ayarlar.kayıt.yetkilirol)
        let hesapOlusturmaTarihi = member.user.createdTimestamp;
        let simdi = Date.now();
        let fark = simdi - hesapOlusturmaTarihi;
        let birAy = 30 * 24 * 60 * 60 * 1000;

        let hesapDurumu = fark >= birAy ? "`✅ Güvenilir!`" : "`❌ Güvenilir Değil!`";
        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({ name: `Yeni Bir Kullanıcı Katıldı, 👋 ${member.user.username}`, iconURL: member.user.avatarURL() })
            .setDescription(`**Sunucumuza hoş geldin ${member}**\n\n**Seninle birlikte ${member.guild.memberCount} kişiyiz.**\n\n> **Hesap oluşturulma tarihi:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n> **Güvenilirlik durumu: ${hesapDurumu}**`)
            .setTimestamp()
        await kayıtkanal.send({ content: `${kayıtyt}`, embeds: [embed] })
        await member.roles.add(ayarlar.kayıt.kayıtsızrol).catch((err) => { console.log(err) })

    }
})


