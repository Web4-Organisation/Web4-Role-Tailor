// src/ai/flows/suggest-roles.ts
'use server';
/**
 * @fileOverview A flow for suggesting roles based on questionnaire answers.
 *
 * - suggestRoles - A function that takes questionnaire answers and returns suggested roles.
 * - SuggestRolesInput - The input type for the suggestRoles function.
 * - SuggestRolesOutput - The return type for the suggestRoles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRolesInputSchema = z.object({
  questionnaireAnswers: z
    .string()
    .describe('Answers to the questionnaire about user roles and permissions.'),
});
export type SuggestRolesInput = z.infer<typeof SuggestRolesInputSchema>;

const SuggestRolesOutputSchema = z.object({
  suggestedRoles: z
    .string()
    .describe('A list of suggested roles based on the questionnaire answers.'),
});
export type SuggestRolesOutput = z.infer<typeof SuggestRolesOutputSchema>;

export async function suggestRoles(input: SuggestRolesInput): Promise<SuggestRolesOutput> {
  return suggestRolesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRolesPrompt',
  input: {schema: SuggestRolesInputSchema},
  output: {schema: SuggestRolesOutputSchema},
  prompt: `Based on the following questionnaire answers, suggest a list of user roles that would be appropriate for the application:

Questionnaire Answers: {{{questionnaireAnswers}}}

Suggest roles that cover a wide spectrum of permissions and access levels. Return a comma separated list of roles.
`,
});

const suggestRolesFlow = ai.defineFlow(
  {
    name: 'suggestRolesFlow',
    inputSchema: SuggestRolesInputSchema,
    outputSchema: SuggestRolesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
