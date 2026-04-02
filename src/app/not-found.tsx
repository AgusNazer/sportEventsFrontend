import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Pagina no encontrada</h1>
      <p className="text-gray-500 text-sm mb-6">
        El evento o pagina que buscas no existe o fue eliminado.
      </p>
      <Link href="/" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
