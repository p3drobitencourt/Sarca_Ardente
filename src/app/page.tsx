import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="flex flex-col items-center pt-8 min-h-screen bg-gray-100 px-4">
      <div className="text-center mb-8">
        <Icons.logo className="h-16 w-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold mt-4">Sarça Ardente</h1>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs sm:flex-row sm:justify-center sm:gap-4">
        <Button asChild className="w-full sm:w-auto">
          <Link href="attendance/record">Registrar Presença</Link>
        </Button>
        <Button variant={"outline"} asChild className="w-full sm:w-auto">
          <Link href="/members">Membros</Link>
        </Button>
        <Button variant={"outline"} asChild className="w-full sm:w-auto">
          <Link href="attendance/reports">Relatórios</Link>
        </Button>
        <Button variant={"outline"} asChild className="w-full sm:w-auto">
          <Link href="/dashboard">Painel de Controle</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;