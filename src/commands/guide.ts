import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type { Command } from './index.js';

const guidesInfo = {
	ram: { 
		name: 'Changing RAM Allocation', 
		url: 'https://www.landfall.world/guides/changing-allocated-ram-in-modrinth-launcher/'
	},
	logs: { 
		name: 'Locating Logs & Crash Reports', 
		url: 'https://www.landfall.world/guides/submitting-logs-and-crash-reports/'
	},
    mtr: { 
		name: 'Running an MTR', 
		url: 'https://www.landfall.world/guides/running-an-mtr/'
	},
	nations: { 
		name: 'Establishing Nations', 
		url: 'https://www.landfall.world/procedures/establishing-nations/'
	},
	characters: { 
		name: 'Character Guidelines', 
		url: 'https://www.landfall.world/procedures/character-guidelines/'
	},
	rulesofwar: { 
		name: 'Rules of War', 
		url: 'https://www.landfall.world/procedures/rules-of-war/'
	}
} as const;

export default {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Get quick links to various guides')
		.addStringOption(option => {
			const opt = option
				.setName('topic')
				.setDescription('The tutorial topic you need help with')
				.setRequired(true);
			
			// Generate choices automatically from guidesInfo
			Object.entries(guidesInfo).forEach(([value, info]) => {
				opt.addChoices({ name: info.name, value });
			});
			
			return opt;
		})
		.toJSON(),

	async execute(interaction: CommandInteraction): Promise<void> {
		const topic = interaction.options.get('topic')?.value as string;
		const guideInfo = guidesInfo[topic as keyof typeof guidesInfo];
		
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setLabel('📖 Open Guide')
					.setStyle(ButtonStyle.Link)
					.setURL(guideInfo.url)
			);

		await interaction.reply({
			content: `:books: Here's the guide for **${guideInfo.name}**:`,
			components: [row]
		});
	},
} satisfies Command;
