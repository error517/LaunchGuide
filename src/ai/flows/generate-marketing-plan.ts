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
  productDescription: z.string().describe('A description of the product or service.'),
  targetAudience: z.string().describe('A description of the target audience.'),
  businessGoal: z.string().describe('The primary business goal (e.g., first 10 paying customers, 100 beta users).'),
  budgetConstraints: z.string().describe('Budget constraints (e.g., <$500/month, time-only).'),
  marketingKnowledge: z.string().describe('Self-assessment of marketing knowledge (e.g., beginner, some familiarity).'),
  channel: z.string().describe('The marketing channel to generate a plan for (e.g., Content Marketing, SEO).'),
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
      productDescription: z.string().describe('A description of the product or service.'),
      targetAudience: z.string().describe('A description of the target audience.'),
      businessGoal: z.string().describe('The primary business goal (e.g., first 10 paying customers, 100 beta users).'),
      budgetConstraints: z.string().describe('Budget constraints (e.g., <$500/month, time-only).'),
      marketingKnowledge: z.string().describe('Self-assessment of marketing knowledge (e.g., beginner, some familiarity).'),
      channel: z.string().describe('The marketing channel to generate a plan for (e.g., Content Marketing, SEO).'),
    }),
  },
  output: {
    schema: z.object({
      planSteps: z.array(z.string()).describe('A list of step-by-step actions for the marketing plan.'),
    }),
  },
  prompt: `You are an expert marketing consultant for early-stage technical founders.

You will generate a step-by-step marketing plan for the given channel, tailored to the founder's specific situation.

Consider the following information when creating the plan:

*   Product Description: {{{productDescription}}}
*   Target Audience: {{{targetAudience}}}
*   Business Goal: {{{businessGoal}}}
*   Budget Constraints: {{{budgetConstraints}}}
*   Marketing Knowledge: {{{marketingKnowledge}}}
*   Marketing Channel: {{{channel}}}

The plan should be extremely specific and actionable, breaking down each step into the smallest feasible first steps for a beginner.
Include links to simple external resources where appropriate.

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
