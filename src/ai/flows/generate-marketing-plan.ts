'use server';
/**
 * @fileOverview Generates a marketing plan for a given channel based on user input.
 *
 * - generateMarketingPlan - A function that generates a marketing plan.
 * - GenerateMarketingPlanInput - The input type for the generateMarketingPlan function.
 * - GenerateMarketingPlanOutput - The return type for the generateMarketingPlan function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMarketingPlanInputSchema = z.object({
  productOverview: z.string().describe('A brief description of the product or service (1-2 sentences).'),
  coreValueProposition: z.string().describe('The most unique, urgent, or emotionally resonant benefit of the product.'),
  targetAudience: z.string().describe('The ideal user (demographics, psychographics, interests, behavior patterns).'),
  currentAwareness: z.enum(['Just an idea', 'MVP live', 'Some beta users', 'Public launch', 'Revenue generating']).describe('What stage is the product at?'),
  goal: z.enum(['Awareness', 'Waitlist signups', 'App downloads', 'Purchases/Users', 'Feedback/Validation', 'Brand credibility']).describe('What are you trying to achieve from this campaign?'),
  budget: z.number().describe('The total budget willing to invest in marketing over the next 30-60 days.'),
  strengthsToLeverage: z.string().describe('Advantages or assets you already have (e.g., email list, early fans, influencer access).'),
  majorConstraints: z.string().describe('Limitations in time, money, team, legal, or platform (e.g., "Instagram account restricted").'),
  marketing_channel_types: z.array(z.string()).describe('Preferred marketing channel types (e.g., Paid ads, Partnerships/affiliates).'),
  toneAndBrandPersonality: z.string().describe('How the brand should feel in marketing materials (e.g., bold, cheeky, trustworthy).'),
  email: z.string().email().describe('Email address to send recommendations to.'),
});
export type GenerateMarketingPlanInput = z.infer<typeof GenerateMarketingPlanInputSchema>;

const GenerateMarketingPlanOutputSchema = z.object({
  planSteps: z.array(z.string()).describe('A list of step-by-step actions for the marketing plan.'),
});
export type GenerateMarketingPlanOutput = z.infer<typeof GenerateMarketingPlanOutputSchema>;

export async function generateMarketingPlan(input: GenerateMarketingPlanInput): Promise<GenerateMarketingPlanOutput> {
  return generateMarketingPlanFlow(input);
}

const generateMarketingPlanPrompt = ai.definePrompt({
  name: 'generateMarketingPlanPrompt',
  input: {
    schema: z.object({
      productOverview: z.string().describe('A brief description of the product or service (1-2 sentences).'),
      coreValueProposition: z.string().describe('The most unique, urgent, or emotionally resonant benefit of the product.'),
      targetAudience: z.string().describe('The ideal user (demographics, psychographics, interests, behavior patterns).'),
      currentAwareness: z.string().describe('What stage is the product at?'),
      goal: z.string().describe('What are you trying to achieve from this campaign?'),
      budget: z.number().describe('The total budget willing to invest in marketing over the next 30-60 days.'),
      strengthsToLeverage: z.string().describe('Advantages or assets you already have (e.g., email list, early fans, influencer access).'),
      majorConstraints: z.string().describe('Limitations in time, money, team, legal, or platform (e.g., "Instagram account restricted").'),
      marketing_channel_types: z.array(z.string()).describe('Preferred marketing channel types (e.g., Paid ads, Partnerships/affiliates).'),
      toneAndBrandPersonality: z.string().describe('How the brand should feel in marketing materials (e.g., bold, cheeky, trustworthy).'),
      email: z.string().email().describe('Email address to send recommendations to.'),
    }),
  },
  output: {
    schema: z.object({
      planSteps: z.array(z.string()).describe('A list of step-by-step actions for the marketing plan.'),
    }),
  },
  prompt: `You are an expert marketing consultant for early-stage technical founders.
You will generate a step-by-step marketing plan tailored to the founder's specific situation.
Consider the following information when creating the plan:
*   Product Overview: {{{productOverview}}}
*   Core Value Proposition: {{{coreValueProposition}}}
*   Target Audience: {{{targetAudience}}}
*   Current Awareness: {{{currentAwareness}}}
*   Goal: {{{goal}}}
*   Budget: {{{budget}}}
*   Strengths to Leverage: {{{strengthsToLeverage}}}
*   Major Constraints: {{{majorConstraints}}}
*   Preferred Channel Types: {{{marketing_channel_types}}}
*   Tone & Brand Personality: {{{toneAndBrandPersonality}}}

The plan should be extremely specific and actionable, breaking down each step into the smallest feasible first steps for a beginner.
Include links to simple external resources where appropriate. The plan should be no more than 10 steps.
Output the plan as a numbered list of steps.

Example Output:
[
  "1. Research relevant keywords using a free tool like Google Keyword Planner.",
  "2. Create a content calendar outlining topics and publication dates.",
  "3. Write a blog post targeting one of the chosen keywords.",
  ...
]
`,
});

const generateMarketingPlanFlow = ai.defineFlow<
  typeof GenerateMarketingPlanInputSchema,
  typeof GenerateMarketingPlanOutputSchema
>({
  name: 'generateMarketingPlanFlow',
  inputSchema: GenerateMarketingPlanInputSchema,
  outputSchema: GenerateMarketingPlanOutputSchema,
},
async input => {
  const {output} = await generateMarketingPlanPrompt(input);
  return output!;
}
);
