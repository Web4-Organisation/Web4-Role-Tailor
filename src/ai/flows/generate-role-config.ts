// src/ai/flows/generate-role-config.ts
'use server';

/**
 * @fileOverview Generates a role configuration file (JSON/YAML) based on user input from a questionnaire.
 *
 * - generateRoleConfig - A function that generates the role configuration.
 * - GenerateRoleConfigInput - The input type for the generateRoleConfig function.
 * - GenerateRoleConfigOutput - The return type for the generateRoleConfig function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoleSchema = z.object({
  name: z.string().describe('The name of the role.'),
  permissions: z.array(z.string()).describe('The permissions associated with the role.'),
  inherits: z.array(z.string()).optional().describe('Roles from which this role inherits permissions.'),
});

const GenerateRoleConfigInputSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  roles: z.array(RoleSchema).describe('The roles to configure with their permissions and inheritance.'),
  outputFormat: z.enum(['json', 'yaml']).describe('The desired output format (JSON or YAML).'),
});

export type GenerateRoleConfigInput = z.infer<typeof GenerateRoleConfigInputSchema>;

const GenerateRoleConfigOutputSchema = z.object({
  configFileContent: z.string().describe('The content of the generated configuration file.'),
});

export type GenerateRoleConfigOutput = z.infer<typeof GenerateRoleConfigOutputSchema>;

export async function generateRoleConfig(input: GenerateRoleConfigInput): Promise<GenerateRoleConfigOutput> {
  return generateRoleConfigFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoleConfigPrompt',
  input: {
    schema: GenerateRoleConfigInputSchema,
  },
  output: {
    schema: GenerateRoleConfigOutputSchema,
  },
  prompt: `You are a configuration file generation expert.

  Based on the provided application name, roles, permissions, and desired output format, generate a valid configuration file.

  Application Name: {{{appName}}}
  Roles: {{#each roles}}{{{this}}}{{/each}}
  Output Format: {{{outputFormat}}}

  Ensure the generated configuration file is well-formatted and adheres to the specified output format.

  Here's how the roles are defined:
  {{#each roles}}
    Role Name: {{{this.name}}}
    Permissions: {{#each this.permissions}}{{{this}}}, {{/each}}
    {{#if this.inherits}}
      Inherits from: {{#each this.inherits}}{{{this}}}, {{/each}}
    {{/if}}
  {{/each}}

  Output the configuration file content:
  `,
});

const generateRoleConfigFlow = ai.defineFlow(
  {
    name: 'generateRoleConfigFlow',
    inputSchema: GenerateRoleConfigInputSchema,
    outputSchema: GenerateRoleConfigOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
