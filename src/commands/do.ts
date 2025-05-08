import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Rcon } from 'rcon-client';
import type { Command } from './index.js';
import { hasModeratorRole } from '../util/permissions.js';

const RCON_HOST = process.env.RCON_HOST || '127.0.0.1';
const RCON_PORT = Number(process.env.RCON_PORT) || 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD || '';

const ALLOWED_COMMANDS = [
	'tp',
	'kick',
	'nickban',
	'weather',
	'gamemode',
	'effect',
	'clear',
	'list',
	'randomname',
	'give'
];

function cleanResponse(response: string): string {
	return response.replace(/§[0-9a-fk-or]/g, '');
}

function isCommandAllowed(command: string): boolean {
	const baseCommand = command.split(' ')[0].toLowerCase();
	return ALLOWED_COMMANDS.includes(baseCommand);
}

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
				content: '❌ You do not have permission to use this command. If you need to use a command at a higher level, please ask an administrator to do it for you or use the sudo command.',
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

		if (!isCommandAllowed(command)) {
			await interaction.reply({
				content: '❌ This command is not allowed. Allowed commands are: ' + ALLOWED_COMMANDS.join(', '),
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

			await interaction.editReply(`✅ Command executed: \`${command}\`\n📝 Server response: \`${cleanResponse(response || 'No output')}\``);
		} catch (error) {
			console.error('RCON Error:', error);
			await interaction.editReply({
				content: '❌ Failed to execute the command on the Minecraft server.',
			});
		}
	},
} satisfies Command;