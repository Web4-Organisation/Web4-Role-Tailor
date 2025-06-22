'use server';
import { generateRoleConfig } from '@/ai/flows/generate-role-config';
import { suggestRoles } from '@/ai/flows/suggest-roles';
import type { GenerateRoleConfigInput } from '@/ai/flows/generate-role-config';
import type { SuggestRolesInput } from '@/ai/flows/suggest-roles';
import { z } from 'zod';
import { RoleSchema } from '@/types/role';

const SuggestRolesOutputSchema = z.string().transform((str) => str.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean));

export async function suggestRolesAction(input: SuggestRolesInput) {
  const result = await suggestRoles(input);
  return SuggestRolesOutputSchema.parse(result.suggestedRoles);
}

const GenerateRoleConfigActionInputSchema = z.object({
  appName: z.string(),
  roles: z.array(RoleSchema),
  outputFormat: z.enum(['json', 'yaml']),
})

export async function generateRoleConfigAction(input: GenerateRoleConfigInput) {
  const validatedInput = GenerateRoleConfigActionInputSchema.parse(input);
  const result = await generateRoleConfig(validatedInput);
  return result.configFileContent;
}
