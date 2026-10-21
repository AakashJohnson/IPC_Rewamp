export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={e => {
        // Move focus explicitly so the next Tab continues from the main content.
        const main = document.getElementById('main');
        if (main) {
          e.preventDefault();
          main.focus();
          main.scrollIntoView();
        }
      }}
      className="sr-only z-[100] rounded-sm bg-navy-900 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
