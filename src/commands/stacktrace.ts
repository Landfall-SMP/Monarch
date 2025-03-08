import { CommandInteraction, SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import type { Command } from './index.js';
import path from 'path';

export default {
	data: new SlashCommandBuilder()
		.setName('stacktrace')
		.setDescription('I feel like Conf is gonna need this at some point...')
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		const filePath = path.resolve('./assets/error.jpg');

		const attachment = new AttachmentBuilder(filePath, { name: 'error.jpg' });

		await interaction.reply({ files: [attachment] });
	},
} satisfies Command;
