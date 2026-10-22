/**
 * "Powered by Anuvadini" — secondary attribution using the supplied Anuvadini logo, served locally from
 * /images/brand (only its uniform white margin trimmed; proportions and colours untouched).
 * Attribution only: the हिन्दी link still opens the official Hindi pages. No translation API is connected.
 */
export function AnuvadiniAttribution({ size = 'sm', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const h = size === 'sm' ? 24 : 34;
  return (
    <a
      href="https://anuvadini.aicte.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-white py-1 pl-3 pr-2 text-navy-900 ring-1 ring-black/5 transition-shadow hover:shadow-lift ${className}`}
    >
      <span className={`whitespace-nowrap font-medium ${size === 'sm' ? 'text-[0.75rem]' : 'text-[0.8125rem]'}`}>Powered by</span>
      <img
        src="/images/brand/anuvadini-logo-96.png"
        width={Math.round((319 / 96) * h)}
        height={h}
        alt="Anuvadini"
        style={{ height: h, width: 'auto' }}
        className="block"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
