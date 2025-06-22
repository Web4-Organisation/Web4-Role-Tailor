'use client';
import { useState } from 'react';
import { Header } from '@/components/app/header';
import { RoleEditor } from '@/components/app/role-editor';
import { RoleVisualizer } from '@/components/app/role-visualizer';
import { ConfigGenerator } from '@/components/app/config-generator';
import type { Role } from '@/types/role';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [appName, setAppName] = useState<string>('Web4MyApp');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <RoleEditor roles={roles} setRoles={setRoles} appName={appName} setAppName={setAppName} />
          </div>
          <div className="flex flex-col gap-8 lg:sticky top-8">
            <RoleVisualizer roles={roles} />
            <Separator />
            <ConfigGenerator roles={roles} appName={appName} />
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground">
          Built with Next.js and Genkit.
      </footer>
    </div>
  );
}
