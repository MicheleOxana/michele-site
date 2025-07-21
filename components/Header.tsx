import Link from 'next/link';

export default function Header() {
  return (
    <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
      <h1 className="text-2xl font-bold tracking-widest">
        💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span>
      </h1>
      <nav className="space-x-3 text-sm font-bold tracking-wide uppercase text-fuchsia-300">
        <Link href="/" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Início</a>
        </Link>
        <Link href="/primeiros-passos" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Primeiros Passos</a>
        </Link>
        <Link href="/sobre" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Sobre</a>
        </Link>
        <Link href="/xaninhas-coins" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Xaninhas Coins</a>
        </Link>
        <Link href="/comandos" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Comandos</a>
        </Link>
        <Link href="/loja" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Loja</a>
        </Link>
        <Link href="/conteudos" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Conteúdos</a>
        </Link>
        <Link href="/grimward" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Grimward</a>
        </Link>
        <Link href="/cantinho-do-viewer" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Cantinho do Viewer</a>
        </Link>
        <Link href="/agradecimento" legacyBehavior>
          <a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Agradecimento</a>
        </Link>
      </nav>
    </header>
  );
}
