import { CommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import type { Command } from './index.js';
import { hasModeratorRole } from '../util/permissions.js';

export default {
  data: new SlashCommandBuilder()
    .setName('preclose')
    .setDescription('Sends an anonymous message about ticket resolution to the current channel')
    .toJSON(),

  async execute(interaction: CommandInteraction): Promise<void> {
    if (!hasModeratorRole(interaction)) {
      await interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true,
      });
      return;
    }

    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) {
      await interaction.reply({
        content: '❌ This command can only be used in text channels.',
        ephemeral: true,
      });
      return;
    }

    const message = ":exclamation: **If this issue is resolved, please close the ticket.**\n-# If you have any further questions or concerns, please let us know so we don't close it out by mistake.";

    try {
      await interaction.channel.send(message);
      await interaction.reply({
        content: '✅ Message sent successfully.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Preclose Message Error:', error);
      await interaction.reply({
        content: '❌ Failed to send the message.',
        ephemeral: true,
      });
    }
  },
} satisfies Command; 