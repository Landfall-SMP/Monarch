import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from './index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('rtfm')
		.setDescription('I can\'t believe I needed to make this.')
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder()
			.setColor(0x3498db)
			.setTitle('📖 Please Read our Information Channel')
			.setDescription(
				`We're happy to help, but please be sure to read <#1033845386093264926> before posting a question. It was written specifically to answer the questions we are asked most often.\n\n*Pro tip: Discord has a search feature you can access by clicking the search icon in the top right corner of the chat.*`)
			.setFooter({ text: 'Landfall SMP'})
			.setTimestamp();

		await interaction.reply({ embeds: [embed]});
	},
} satisfies Command;
