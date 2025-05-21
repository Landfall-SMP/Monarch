import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type { Command } from './index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('faq')
		.setDescription('Sends a message with basic Landfall SMP info and important links.')
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		// Create an embed with the Landfall SMP info
		const embed = new EmbedBuilder()
			.setColor(0x3498db) // Blue theme
			.setTitle('🌍⚔️ Landfall SMP FAQ')
			.setDescription(
				`Welcome in! We're happy to help, but please be sure to read <#1033845386093264926>. Almost all common questions from new players are answered there. **For your convenience, we've rounded up a few frequently asked questions answered below.**\n\n`
				+ ` 1. **What is the IP:** The server IP is included in the modpack.\n\n`
				+ ` 2. **Account Linking:** Attempt to join the server and you'll receive a code. Use \`/link <code>\` in Discord to pair your accounts. (The bot you need to send it to is named Sentinel.) After that, you can play!\n\n`
                + ` 3. **Can I play Cracked/Bedrock:** No, this is a modded Java server.\n\n`
                + ` 4. **"But I use CurseForge!!":** That's fine, you can manually convert the modpack. We recommend Modrinth for simplicity, and is the only platform we can promise a working installation on.\n\n`
                + `*We encourage you to read the info channel, but understand some individuals may not. Ignorance is not an excuse for breaking rules. You are expected to adhere to the server rules and procedures even if you elect not to read them.*\n\n`
			)
			.setFooter({ text: 'Landfall SMP'})
			.setTimestamp();

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('📥 Download the Modpack')
				.setStyle(ButtonStyle.Link)
				.setURL('https://modrinth.com/modpack/landfall-530-noble-blood'),

			new ButtonBuilder()
				.setLabel('📖 Visit the Wiki')
				.setStyle(ButtonStyle.Link)
				.setURL('https://landfall.world')
		);

		// Send the embed with buttons
		await interaction.reply({ embeds: [embed], components: [row] });
	},
} satisfies Command;
