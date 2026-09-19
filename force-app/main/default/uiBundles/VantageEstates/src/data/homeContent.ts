/**
 * Static placeholder content for the Home page. Not fetched from Salesforce —
 * edit these values directly (or swap this file for a real data source later)
 * once real company facts/copy are available.
 */

export interface HomeStat {
	label: string;
	value: string;
}

export interface HomeProject {
	name: string;
	location: string;
	status: string;
	description: string;
}

export interface HomeContent {
	tagline: string;
	heading: string;
	intro: string;
	stats: HomeStat[];
	projects: HomeProject[];
	closingHeading: string;
	closingBody: string;
}

export const homeContent: HomeContent = {
	tagline: 'Building places people are proud to call home',
	heading: 'Vantage Estates',
	intro:
		'Vantage Estates is a real estate development and management company delivering residential and mixed-use communities across the region. From master-planned neighborhoods to boutique urban developments, we manage every stage of the project lifecycle in-house.',
	stats: [
		{ label: 'Locations', value: '12' },
		{ label: 'Years in business', value: '18' },
		{ label: 'Units delivered', value: '4,300+' },
		{ label: 'Active projects', value: '6' },
	],
	projects: [
		{
			name: 'Willowbrook Commons',
			location: 'Austin, TX',
			status: 'In construction',
			description: 'A 220-unit mixed-use community with retail frontage and a central green.',
		},
		{
			name: 'Harbor Point Residences',
			location: 'Charleston, SC',
			status: 'Planning',
			description: 'Waterfront townhomes and a public boardwalk, breaking ground next year.',
		},
		{
			name: 'The Ridgeline',
			location: 'Denver, CO',
			status: 'Pre-leasing',
			description: 'A 180-unit apartment community with mountain views and on-site amenities.',
		},
	],
	closingHeading: "Let's build what's next",
	closingBody:
		'Whether you are exploring a partnership, looking for availability, or just have a question, our team would love to hear from you.',
};
