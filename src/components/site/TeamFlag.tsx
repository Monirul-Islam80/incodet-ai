/** Small flag symbols, independent of platform emoji fonts. */
export function TeamFlag({ code }: { code: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 30 20"
      className="team-flag h-5 w-[30px] overflow-hidden rounded-[3px]"
    >
      {code === "BD" ? (
        <>
          <path className="flag-green" d="M0 0h30v20H0z" />
          <circle className="flag-red" cx="13" cy="10" r="6" />
        </>
      ) : code === "CA" ? (
        <>
          <path className="flag-white" d="M0 0h30v20H0z" />
          <path
            className="flag-red"
            d="M0 0h7v20H0zM23 0h7v20h-7zM15 3l2 4 2-1-1 4 3 1-5 4v3h-2v-3l-5-4 3-1-1-4 2 1z"
          />
        </>
      ) : (
        <>
          <path className="flag-blue" d="M0 0h30v20H0z" />
          <g transform={code === "AU" ? "scale(.55)" : undefined}>
            <path className="flag-white" d="M0 0h3l27 17v3h-3L0 3zm30 0v3L3 20H0v-3L27 0z" />
            <path className="flag-red" d="M0 0l30 19v1L0 1zm30 0L0 19v1L30 1z" />
            <path className="flag-white" d="M11 0h8v20h-8zM0 6h30v8H0z" />
            <path className="flag-red" d="M13 0h4v20h-4zM0 8h30v4H0z" />
          </g>
          {code === "AU" && (
            <g className="flag-white">
              <path d="m23 4 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2v-2l-2 1 1-2-2-1 2-1-1-2 2 1z" />
              <circle cx="23" cy="15" r="1.5" />
              <circle cx="10" cy="15" r="2" />
            </g>
          )}
        </>
      )}
    </svg>
  );
}
