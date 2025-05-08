import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from './index.js';
import { hasAdminRole } from '../util/permissions.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Sends a direct message to a specific user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to send a message to')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message to send to the user (use \\n for new lines)')
        .setRequired(true)
    )
    .toJSON(),

  async execute(interaction: CommandInteraction): Promise<void> {
    // Check if the user has permission to use this command
    if (!hasAdminRole(interaction)) {
      await interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.get('user')?.user;
    let messageContent = interaction.options.get('message')?.value as string;

    if (!targetUser || !messageContent) {
      await interaction.reply({
        content: '❌ You must provide both a user and a message.',
        ephemeral: true,
      });
      return;
    }

    // Replace \n with actual new lines
    messageContent = messageContent.replace(/\\n/g, '\n');

    try {
      // Send the direct message to the user
      await targetUser.send(messageContent);
      
      // Preview the message that was sent (truncated if too long)
      const previewMessage = messageContent.length > 1000 
        ? messageContent.substring(0, 997) + '...' 
        : messageContent;
      
      // Reply to the interaction, confirming the message was sent
      await interaction.reply({
        content: `✅ Message successfully sent to ${targetUser.tag}!\n\n**Preview:**\n${previewMessage}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Direct Message Error:', error);
      
      // Handle the case where sending the DM fails (e.g., user has DMs disabled)
      await interaction.reply({
        content: `❌ Failed to send message to ${targetUser.tag}. They may have DMs disabled or have blocked the bot.`,
        ephemeral: true,
      });
    }
  },
} satisfies Command;