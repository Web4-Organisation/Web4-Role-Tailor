'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateRoleConfigAction } from '@/actions/ai';
import type { Role } from '@/types/role';
import { Copy, Download, FileJson, FileText, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ConfigGeneratorProps {
  roles: Role[];
  appName: string;
}

export function ConfigGenerator({ roles, appName }: ConfigGeneratorProps) {
  const [format, setFormat] = useState<'json' | 'yaml'>('json');
  const [config, setConfig] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (roles.length === 0) {
      toast({
        title: 'No Roles Defined',
        description: 'Please add at least one role before generating the configuration.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const generatedConfig = await generateRoleConfigAction({
          appName,
          roles,
          outputFormat: format,
        });
        setConfig(generatedConfig);
      } catch (error) {
        toast({
          title: 'Error Generating Config',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
        console.error(error);
      }
    });
  };

  const handleCopy = () => {
    if (!config) return;
    navigator.clipboard.writeText(config);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = () => {
    if (!config) return;
    const blob = new Blob([config], { type: format === 'json' ? 'application/json' : 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roles.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Generate Configuration</CardTitle>
        <CardDescription>Select your desired format and generate the config file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as 'json' | 'yaml')} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer"><FileJson className="h-4 w-4" /> JSON</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yaml" id="yaml" />
              <Label htmlFor="yaml" className="flex items-center gap-2 cursor-pointer"><FileText className="h-4 w-4" /> YAML</Label>
            </div>
          </RadioGroup>
          <Button onClick={handleGenerate} disabled={isPending || roles.length === 0} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </Button>
        </div>

        <AnimatePresence>
          {config && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto max-h-80 font-code">
                <code>{config}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDownload} className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
