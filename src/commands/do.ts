import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Rcon } from 'rcon-client';
import type { Command } from './index.js';
import { hasModeratorRole } from '../util/permissions.js';

const RCON_HOST = process.env.RCON_HOST || '127.0.0.1';
const RCON_PORT = Number(process.env.RCON_PORT) || 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD || '';

// List of allowed moderating commands
const ALLOWED_COMMANDS = [
	'kick',
	'whitelist',
	'gamemode',
	'tp',
	'time',
	'weather'
];

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
		if (!hasModeratorRole(interaction)) {
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

		// Check if the command is allowed
		const commandBase = command.split(' ')[0].toLowerCase();
		if (!ALLOWED_COMMANDS.includes(commandBase)) {
			await interaction.reply({
				content: `❌ Command "${commandBase}" is not allowed. Only specific commands are permitted. If you are able, use sudo instead.`,
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

			// Strip § symbols from the response
			const cleanResponse = response ? response.replace(/§[0-9a-fk-or]/g, '') : 'No output';

			await interaction.editReply(`✅ Command executed: \`${command}\`\n📝 Server response: \`${cleanResponse}\``);
		} catch (error) {
			console.error('RCON Error:', error);
			await interaction.editReply({
				content: '❌ Failed to execute the command on the Minecraft server.',
			});
		}
	},
} satisfies Command;
