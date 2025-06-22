'use client';

import type { Role } from '@/types/role';
import { useTransition, useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { suggestRolesAction } from '@/actions/ai';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, BrainCircuit, Loader2, Trash2, Pencil, Sparkles, X, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { motion, AnimatePresence } from 'framer-motion';

const roleSchema = z.object({
  name: z.string().min(2, { message: "Role name must be at least 2 characters." }).regex(/^[a-z0-9_]+$/, "Name must be lowercase alphanumeric with underscores."),
  permissions: z.string().min(1, { message: "At least one permission is required." }),
  inherits: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleEditorProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  appName: string;
  setAppName: (name: string) => void;
}

export function RoleEditor({ roles, setRoles, appName, setAppName }: RoleEditorProps) {
  const [questionnaire, setQuestionnaire] = useState('');
  const [isSuggesting, startSuggestion] = useTransition();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: '', permissions: '', inherits: '' },
  });

  const handleSuggestRoles = () => {
    if (!questionnaire.trim()) {
      toast({ title: 'Please describe your application first.', variant: 'destructive' });
      return;
    }
    startSuggestion(async () => {
      try {
        const suggested = await suggestRolesAction({ questionnaireAnswers: questionnaire });
        const newRoles: Role[] = suggested.map(name => ({
          name,
          permissions: ['view_content'],
          inherits: [],
        }));
        setRoles(newRoles);
        toast({
          title: 'Roles Suggested!',
          description: 'AI has suggested some roles for you. Feel free to edit them.',
        });
      } catch (error) {
        toast({ title: 'Suggestion Failed', description: 'Could not get suggestions from AI.', variant: 'destructive' });
      }
    });
  };

  const handleAddOrUpdateRole: SubmitHandler<RoleFormData> = (data) => {
    const permissionsArray = data.permissions.split(',').map(p => p.trim()).filter(Boolean);
    const inheritsArray = data.inherits?.split(',').map(i => i.trim()).filter(Boolean) ?? [];

    if (isEditing) {
      setRoles(roles.map(r => r.name === isEditing ? { ...data, permissions: permissionsArray, inherits: inheritsArray } : r));
      toast({ title: `Role "${data.name}" updated.` });
      setIsEditing(null);
    } else {
      if (roles.some(r => r.name === data.name)) {
        form.setError("name", { type: "manual", message: "Role name already exists." });
        return;
      }
      setRoles([...roles, { ...data, permissions: permissionsArray, inherits: inheritsArray }]);
      toast({ title: `Role "${data.name}" added.` });
    }
    form.reset();
    setIsDialogOpen(false);
  };
  
  const handleEdit = (role: Role) => {
    setIsEditing(role.name);
    form.reset({
      name: role.name,
      permissions: role.permissions.join(', '),
      inherits: role.inherits.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (roleName: string) => {
    setRoles(roles.filter(r => r.name !== roleName).map(r => ({ ...r, inherits: r.inherits.filter(i => i !== roleName)})));
    toast({ title: `Role "${roleName}" deleted.` });
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setIsEditing(null);
    }
    setIsDialogOpen(open);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            1. App Context
          </CardTitle>
          <CardDescription>Tell us about your app to get AI-powered role suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Your Application Name (e.g., 'ProjectHub')" 
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="font-headline"
          />
          <Textarea
            placeholder="Describe your application and its user types. For example: 'A blog platform where admins can manage everything, editors can write and publish posts, and users can comment.'"
            value={questionnaire}
            onChange={(e) => setQuestionnaire(e.target.value)}
            rows={5}
          />
          <Button onClick={handleSuggestRoles} disabled={isSuggesting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSuggesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Suggest Roles with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-xl border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl text-primary">2. Define Roles</CardTitle>
            <CardDescription>Manually add, edit, or remove roles and their permissions.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline">{isEditing ? 'Edit Role' : 'Add a New Role'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddOrUpdateRole)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., admin" {...field} disabled={!!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="permissions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permissions</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., create_post, delete_user" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="inherits" render={({ field }) => (
                     <FormItem>
                      <FormLabel>Inherits From (optional)</FormLabel>
                      <FormControl>
                         <Input placeholder="e.g., user, guest" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isEditing ? 'Update Role' : 'Add Role'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No roles defined yet. Get suggestions from AI or add one manually!</p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {roles.map((role) => (
                  <motion.div 
                    key={role.name}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold font-headline text-lg text-primary">{role.name}</h3>
                        {role.inherits.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>inherits</span>
                            {role.inherits.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="bg-accent/20 border-accent/50 text-accent-foreground">{perm}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 self-start sm:self-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(role)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(role.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
