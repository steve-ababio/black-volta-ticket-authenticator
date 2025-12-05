import { Shield, Wifi } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight">
                <span className="text-foreground">BLAC</span>
                <span className="text-primary">VOLTA</span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Ticket Authenticator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-success">
            <Wifi className="w-4 h-4" />
            <span className="text-xs font-medium">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
