// app/components/ui/loader.tsx

import { Icons } from "@/components/icons";

export function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Icons.logo className="h-12 w-12 animate-pulse text-primary" />
    </div>
  );
}
