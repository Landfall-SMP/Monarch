import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type { Command } from './index.js';
import { hasAdminRole } from '../util/permissions.js';

export default {
	data: new SlashCommandBuilder()
		.setName('telemetry')
		.setDescription('Get quick access to the telemetry dashboards.')
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
        if (!hasAdminRole(interaction)) {
			await interaction.reply({
				content: '❌ You do not have permission to use this command.',
				ephemeral: true,
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setColor(0x3498db) // Blue theme
			.setTitle('Landfall Telemetry')
			.setDescription(
				`Find telemetry dashboards for the Landfall SMP here.`
			)

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('🌀 Sigil')
				.setStyle(ButtonStyle.Link)
				.setURL('https://telemetry.landfall.world/d/ba46db32-1b8c-4758-98c0-af30972b1e56/sigil?kiosk'),

			new ButtonBuilder()
				.setLabel('🌐 Server')
				.setStyle(ButtonStyle.Link)
				.setURL('https://telemetry.landfall.world/d/rYdddlPWka/node-exporter-full?kiosk')
		);

		await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
	},
} satisfies Command;
