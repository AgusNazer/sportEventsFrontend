export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center">

          <div className="flex items-center gap-4 text-xl select-none">
            <span title="Running">🏃</span>
            <span title="Ciclismo">🚴</span>
            <span title="Natacion">🏊</span>
            <span title="Triatlon">🏅</span>
            <span title="Montaña">🏔️</span>
          </div>

          <p className="text-gray-500 text-sm max-w-xs leading-relaxed italic">
            "Cada kilómetro empieza con una largada. Encontrá la tuya."
          </p>

          <div className="h-px w-12 bg-white/10" />

          <p className="text-xs text-gray-600">
            Creación y desarrollo por{" "}
            <a
              href="https://www.linkedin.com/in/agustinnazer"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Agus Nazer
            </a>
            {" "}—{" "}
            <span className="text-gray-700">SportEvents AR</span>{" "}
            <span className="text-gray-700">&copy; {new Date().getFullYear()}</span>
          </p>

        </div>
      </div>
    </footer>
  );
}
