import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { hasAdminRole } from '../util/permissions.js';
import type { Command } from './index.js';
import fetch from 'node-fetch';

const DIVINE_WEBHOOK = process.env.DIVINE_ENTITY_WEBHOOK!;

export default {
	data: new SlashCommandBuilder()
		.setName('decree')
		.setDescription('Send an announcement as The Divine Entity.')
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('The announcement message')
				.setRequired(true)
		)
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!hasAdminRole(interaction)) {
			await interaction.reply({ content: '❌ You do not have permission to speak as The Divine Entity.', ephemeral: true });
			return;
		}

		const message = interaction.options.get('message')?.value as string;

		// Webhook payload
		const payload = {
			username: 'The Divine Entity',
			content: `🌌 **A Divine Revelation Echoes Across Landfall...**\n>>> ${message}`,
		};

		try {
			await fetch(DIVINE_WEBHOOK, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			await interaction.reply({ content: `✅ The Divine Entity has spoken.`, ephemeral: true });
		} catch (error) {
			console.error('Webhook Error:', error);
			await interaction.reply({ content: '❌ Failed to send the divine message.', ephemeral: true });
		}
	},
} satisfies Command;
