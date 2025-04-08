import { CommandInteraction, GuildMember } from 'discord.js';

const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID!;
const MODERATOR_ROLE_ID = process.env.MODERATOR_ROLE_ID!;

export function hasAdminRole(interaction: CommandInteraction): boolean {
	const member = interaction.member as GuildMember | null;
	if (!member) return false;

	return member.roles.resolve(ADMIN_ROLE_ID) !== null;
}

export function hasModeratorRole(interaction: CommandInteraction): boolean {
	const member = interaction.member as GuildMember | null;
	if (!member) return false;

	return member.roles.resolve(MODERATOR_ROLE_ID) !== null;
}
