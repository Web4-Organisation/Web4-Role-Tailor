'use client';

import type { Role } from '@/types/role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCommitHorizontal, GanttChartSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleVisualizerProps {
  roles: Role[];
}

interface RoleNodeProps {
  role: Role;
  allRoles: Role[];
  level: number;
}

function RoleNode({ role, allRoles, level }: RoleNodeProps) {
  const children = allRoles.filter(r => r.inherits.includes(role.name));

  return (
    <motion.div 
      className="relative pl-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: level * 0.05 }}
    >
      <div className="absolute left-2.5 top-5 -bottom-2 w-px bg-border"></div>
      <div className="absolute left-2.5 top-4 h-px w-3 bg-border"></div>
      <div className="absolute left-0 top-3 p-1 bg-background rounded-full">
         <GitCommitHorizontal className="h-4 w-4 text-primary" />
      </div>

      <div className="mb-4 relative">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="font-bold font-headline text-lg text-primary">{role.name}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {role.permissions.map((perm) => (
              <Badge key={perm} variant="outline" className="bg-accent/20 border-accent/50 text-accent-foreground">{perm}</Badge>
            ))}
          </div>
        </div>
      </div>
      {children.map(childRole => (
        <RoleNode key={childRole.name} role={childRole} allRoles={allRoles} level={level + 1} />
      ))}
    </motion.div>
  );
}

export function RoleVisualizer({ roles }: RoleVisualizerProps) {
  const rootRoles = roles.filter(role => !roles.some(parent => role.inherits.includes(parent.name)));

  return (
    <Card className="shadow-lg rounded-xl border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
          <GanttChartSquare className="h-6 w-6" />
          Role Hierarchy
        </CardTitle>
        <CardDescription>A visual representation of your role inheritance.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[10rem] overflow-x-auto">
        {roles.length > 0 ? (
          <div className="space-y-2">
            {rootRoles.map(role => (
              <RoleNode key={role.name} role={role} allRoles={roles} level={0} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Your role hierarchy will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
