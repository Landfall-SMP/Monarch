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
		name: 'Creating a Group', 
		url: 'https://www.landfall.world/procedures/groups/creating-a-group/'
	},
	characters: { 
		name: 'Character Guidelines', 
		url: 'https://www.landfall.world/procedures/characters/character-guidelines/'
	},
	rulesofwar: { 
		name: 'Rules of War', 
		url: 'https://www.landfall.world/procedures/war-and-conflict/rules-of-war/'
	},
	metagaming: { 
		name: 'Metagaming', 
		url: 'https://www.landfall.world/procedures/misc-roleplay/metagaming/'
	},
	powergaming: { 
		name: 'Powergaming', 
		url: 'https://www.landfall.world/procedures/misc-roleplay/powergaming/'
	},
	frontline: { 
		name: 'Frontline Mechanic', 
		url: 'https://www.landfall.world/procedures/war-and-conflict/frontline-mechanic/'
	},
	sabotage: { 
		name: 'Sabotage Mechanic', 
		url: 'https://www.landfall.world/procedures/war-and-conflict/sabotage-mechanic/'
	},
	assassination: { 
		name: 'Asssassination Rules', 
		url: 'https://www.landfall.world/procedures/war-and-conflict/assassination-rules/'
	},
	imprisonment: { 
		name: 'Imprisonment Rules', 
		url: 'https://www.landfall.world/procedures/war-and-conflict/imprisonment-rules/'
	},
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
