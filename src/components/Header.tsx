import { LuScanLine } from "react-icons/lu";
export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#bf9f40]/10">
            <img alt="Blacvolta logo" className="aspect-[4/3] object-contain xl:h-auto xl:w-auto" width={60} height={60}  src="/assets/images/logo.png"  />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight">
                <span className="text-foreground">BLAC</span>
                <span className="text-[#bf9f40]">VOLTA</span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Ticket Authenticator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-success">
          <LuScanLine size={35} color="white" />
          </div>
        </div>
      </div>
    </header>
  );
}
