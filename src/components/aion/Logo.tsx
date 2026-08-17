import logo from "@/assets/aion-logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="AION logo: robot head with glowing indigo eyes over a laptop"
        width={44}
        height={44}
        className="h-11 w-11 rounded-xl glow"
      />
      {!compact && (
        <div className="leading-tight">
          <p className="font-sans text-xl font-bold tracking-tight text-foreground">AION</p>
          <p className="text-[11px] text-muted-foreground">Your Intelligence, Accelerated.</p>
        </div>
      )}
    </div>
  );
}
