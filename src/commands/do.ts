import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Rcon } from 'rcon-client';
import type { Command } from './index.js';
import { hasAdminRole } from '../util/permissions.js';

const RCON_HOST = process.env.RCON_HOST || '127.0.0.1';
const RCON_PORT = Number(process.env.RCON_PORT) || 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD || '';

export default {
	data: new SlashCommandBuilder()
		.setName('do')
		.setDescription('Executes a command on the Minecraft server.')
		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('The command to run on the server (e.g., "time set day")')
				.setRequired(true)
		)
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!hasAdminRole(interaction)) {
			await interaction.reply({
				content: '❌ You do not have permission to use this command.',
				ephemeral: true,
			});
			return;
		}

		const command = interaction.options.get('command')?.value as string;
		if (!command) {
			await interaction.reply({
				content: '❌ You must provide a command to run.',
				ephemeral: true,
			});
			return;
		}

		await interaction.reply(`🟡 Running command: \`${command}\`...`);

		try {
			const rcon = await Rcon.connect({
				host: RCON_HOST,
				port: RCON_PORT,
				password: RCON_PASSWORD,
			});
			const response = await rcon.send(command);
			rcon.end();

			await interaction.editReply(`✅ Command executed: \`${command}\`\n📝 Server response: \`${response || 'No output'}\``);
		} catch (error) {
			console.error('RCON Error:', error);
			await interaction.editReply({
				content: '❌ Failed to execute the command on the Minecraft server.',
			});
		}
	},
} satisfies Command;
