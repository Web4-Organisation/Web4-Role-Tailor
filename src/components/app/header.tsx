import { Users } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 18.5C20 16.0147 16.4183 14 12 14C7.58172 14 4 16.0147 4 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 21.5C18 20.1193 15.3137 19 12 19C8.68629 19 6 20.1193 6 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">Web4RoleTailor</h1>
        <p className="text-muted-foreground mt-1.5 ml-2 hidden md:block">Define user roles and permissions with AI.</p>
      </div>
    </header>
  );
}
