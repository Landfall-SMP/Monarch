import { exec } from 'child_process';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from './index.js';
import { hasAdminRole } from '../util/permissions.js';

export default {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the Minecraft server.')
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		// Check if the user has the admin role
		if (!hasAdminRole(interaction)) {
			await interaction.reply({
				content: '❌ You do not have permission to restart the server.',
				ephemeral: true,
			});
			return;
		}

		// ack
		await interaction.reply('🔄 Restarting the Minecraft server...');

        // execute
		exec('sudo systemctl restart mcserver', (error, _, stderr) => {
			if (error) {
				console.error(`Error: ${error.message}`);
				interaction.editReply({
					content: `❌ Failed to restart the server: \`${error.message}\``,
				});
				return;
			}
			if (stderr) {
				console.error(`Stderr: ${stderr}`);
				interaction.editReply({
					content: `⚠️ Server restarted, but there was an issue: \`${stderr}\``,
				});
				return;
			}
			interaction.editReply('✅ Minecraft server restarted successfully.');
		});
	},
} satisfies Command;
