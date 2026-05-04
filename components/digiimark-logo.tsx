import * as React from "react"

type DigiimarkLogoVariant = "dark" | "light"

interface DigiimarkLogoProps extends Omit<React.SVGProps<SVGSVGElement>, "fill"> {
  /**
   * "dark" renders the wordmark in near-black (#0A0A0A) for use on light backgrounds.
   * "light" renders the wordmark in near-white (#F0F0F0) for use on dark backgrounds.
   */
  variant?: DigiimarkLogoVariant
  /** Accessible label exposed via <title>. Defaults to "DigiiMark". */
  title?: string
  /** Disable the bouncing-dot animation (the dots stay at rest). */
  animated?: boolean
}

/**
 * DigiiMark animated wordmark.
 *
 * Re-creates the bouncing i-dots animation from the brand reference. The three
 * i-dots in "Digii" + the m-dot in "mark" bounce in sequence with a soft
 * shadow squash beneath each one.
 *
 * ViewBox is cropped tightly around the wordmark with enough headroom for the
 * dot apex (~22px above baseline) so the logo sits flush at any height.
 */
export function DigiimarkLogo({
  variant = "dark",
  title = "DigiiMark",
  animated = true,
  className,
  ...props
}: DigiimarkLogoProps) {
  const fill = variant === "dark" ? "#0A0A0A" : "#F0F0F0"
  const shadowFill = variant === "dark" ? "rgba(10,10,10,0.22)" : "rgba(255,255,255,0.18)"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 35 375 90"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <title>{title}</title>
      <defs>
        <mask id="dm-hide-dots">
          <rect width="375" height="160" fill="white" />
          <circle cx="75.22" cy="64.32" r="7.5" fill="black" />
          <circle cx="141.87" cy="64.32" r="7.5" fill="black" />
          <circle cx="160.94" cy="64.32" r="7.5" fill="black" />
        </mask>
        <style>
          {`
            @keyframes dm-dot-bounce {
              0%, 100% { transform: translateY(0); }
              10% { transform: translateY(-22px); }
              20% { transform: translateY(0); }
              30% { transform: translateY(-10px); }
              40%, 95% { transform: translateY(0); }
            }
            @keyframes dm-dot-squash {
              0%, 100% { transform: scaleY(1); }
              10% { transform: scaleY(0.7) scaleX(1.3); }
              20% { transform: scaleY(1); }
            }
            .dm-dot {
              ${animated ? "animation: dm-dot-bounce 2.4s ease-in-out infinite;" : ""}
              transform-box: fill-box;
              transform-origin: center;
            }
            .dm-shadow {
              ${animated ? "animation: dm-dot-squash 2.4s ease-in-out infinite;" : ""}
              transform-box: fill-box;
              transform-origin: center;
              opacity: 0.25;
            }
            .dm-d1, .dm-s1 { animation-delay: 0s; }
            .dm-d2, .dm-s2 { animation-delay: 0.28s; }
            .dm-d3, .dm-s3 { animation-delay: 0.56s; }
            @media (prefers-reduced-motion: reduce) {
              .dm-dot, .dm-shadow { animation: none !important; }
            }
          `}
        </style>
      </defs>

      <g mask="url(#dm-hide-dots)" fill={fill}>
        <g transform="translate(11.879378,116.02311)">
          <path d="M 21.433594 0 C 40.429688 0 50.921875 -10.125 50.921875 -28.160156 C 50.921875 -46.265625 40.5 -56.390625 21.433594 -56.390625 L 5.027344 -56.390625 L 5.027344 0 Z M 15.667969 -46.859375 L 21.359375 -46.859375 C 32.742188 -46.859375 40.28125 -41.242188 40.28125 -28.160156 C 40.28125 -14.191406 32.519531 -9.535156 21.285156 -9.535156 L 15.667969 -9.535156 Z" />
        </g>
        <g transform="translate(65.680086,116.02311)">
          <path d="M 9.535156 -46.042969 C 12.859375 -46.042969 15.667969 -48.261719 15.667969 -51.734375 C 15.667969 -55.0625 12.859375 -57.425781 9.535156 -57.425781 C 6.132812 -57.425781 3.398438 -55.0625 3.398438 -51.734375 C 3.398438 -48.261719 6.132812 -46.042969 9.535156 -46.042969 Z M 14.484375 0 L 14.484375 -41.460938 L 4.507812 -41.460938 L 4.507812 0 Z" />
        </g>
        <g transform="translate(84.746852,116.02311)">
          <path d="M 23.578125 15.742188 C 34.515625 15.742188 43.089844 11.605469 43.089844 -2.660156 L 43.089844 -41.460938 L 33.109375 -41.460938 L 33.109375 -36.214844 C 29.785156 -40.871094 26.238281 -42.347656 21.285156 -42.347656 C 10.496094 -42.347656 3.105469 -33.480469 3.105469 -21.0625 C 3.105469 -8.941406 10.496094 -0.0742188 21.285156 -0.0742188 C 26.164062 -0.0742188 29.710938 -1.402344 33.109375 -6.132812 L 33.109375 -0.296875 C 33.109375 4.507812 30.300781 7.980469 23.503906 7.980469 C 18.625 7.980469 15.667969 6.28125 14.414062 2.21875 L 4.359375 2.21875 C 6.132812 12.933594 15.078125 15.742188 23.578125 15.742188 Z M 23.652344 -8.648438 C 17.21875 -8.648438 13.15625 -14.117188 13.15625 -21.210938 C 13.15625 -28.308594 17.21875 -33.777344 23.652344 -33.777344 C 29.933594 -33.777344 34.367188 -28.453125 34.367188 -21.210938 C 34.367188 -13.96875 29.933594 -8.648438 23.652344 -8.648438 Z" />
        </g>
        <g transform="translate(132.3398,116.02311)">
          <path d="M 9.535156 -46.042969 C 12.859375 -46.042969 15.667969 -48.261719 15.667969 -51.734375 C 15.667969 -55.0625 12.859375 -57.425781 9.535156 -57.425781 C 6.132812 -57.425781 3.398438 -55.0625 3.398438 -51.734375 C 3.398438 -48.261719 6.132812 -46.042969 9.535156 -46.042969 Z M 14.484375 0 L 14.484375 -41.460938 L 4.507812 -41.460938 L 4.507812 0 Z" />
        </g>
        <g transform="translate(151.406566,116.02311)">
          <path d="M 9.535156 -46.042969 C 12.859375 -46.042969 15.667969 -48.261719 15.667969 -51.734375 C 15.667969 -55.0625 12.859375 -57.425781 9.535156 -57.425781 C 6.132812 -57.425781 3.398438 -55.0625 3.398438 -51.734375 C 3.398438 -48.261719 6.132812 -46.042969 9.535156 -46.042969 Z M 14.484375 0 L 14.484375 -41.460938 L 4.507812 -41.460938 L 4.507812 0 Z" />
        </g>
        <g transform="translate(170.473332,116.02311)">
          <path d="M 15.667969 0 L 15.667969 -48.113281 L 29.121094 0 L 39.539062 0 L 52.992188 -48.410156 L 52.992188 0 L 63.636719 0 L 63.636719 -56.390625 L 45.898438 -56.390625 L 34.292969 -12.859375 L 22.617188 -56.390625 L 5.027344 -56.390625 L 5.027344 0 Z" />
        </g>
        <g transform="translate(239.128368,116.02311)">
          <path d="M 16.480469 0.8125 C 20.027344 0.8125 23.28125 0.222656 25.867188 -1.476562 C 27.421875 -2.4375 28.601562 -3.769531 29.636719 -5.617188 L 29.636719 0 L 39.613281 0 L 39.613281 -21.582031 C 39.613281 -27.347656 39.613281 -33.851562 34.738281 -38.136719 C 31.632812 -41.019531 26.976562 -42.347656 22.171875 -42.347656 C 13.96875 -42.347656 5.914062 -37.914062 4.433594 -28.234375 L 14.339844 -28.234375 C 15.078125 -32.148438 18.328125 -34.515625 22.097656 -34.515625 C 24.464844 -34.515625 26.386719 -33.851562 27.640625 -32.519531 C 28.898438 -31.1875 29.5625 -29.195312 29.636719 -26.679688 L 17.292969 -24.390625 C 13.820312 -23.722656 10.273438 -22.691406 7.613281 -20.84375 C 4.730469 -18.847656 2.882812 -15.816406 2.882812 -11.382812 C 2.882812 -3.472656 8.648438 0.8125 16.480469 0.8125 Z M 18.921875 -7.019531 C 15.445312 -7.019531 12.859375 -8.648438 12.859375 -11.75 C 12.859375 -13.15625 13.378906 -14.191406 14.191406 -15.003906 C 15.371094 -16.113281 17.074219 -16.851562 19.957031 -17.367188 L 29.859375 -19.363281 C 29.710938 -13.894531 28.601562 -10.347656 24.242188 -8.203125 C 22.617188 -7.390625 20.769531 -7.019531 18.921875 -7.019531 Z" />
        </g>
        <g transform="translate(282.804483,116.02311)">
          <path d="M 14.484375 0 L 14.484375 -19.214844 C 14.484375 -24.683594 15.59375 -28.011719 17.8125 -30.226562 C 19.4375 -31.78125 21.804688 -32.742188 25.203125 -32.742188 L 27.492188 -32.742188 L 27.492188 -42.347656 L 26.3125 -42.347656 C 21.433594 -42.347656 17.664062 -40.871094 14.484375 -36.511719 L 14.484375 -41.460938 L 4.507812 -41.460938 L 4.507812 0 Z" />
        </g>
        <g transform="translate(311.700184,116.02311)">
          <path d="M 14.558594 0 L 14.558594 -20.621094 L 31.410156 0 L 43.679688 0 L 24.019531 -23.503906 L 42.347656 -41.460938 L 29.710938 -41.460938 L 14.558594 -26.164062 L 14.558594 -56.390625 L 4.582031 -56.390625 L 4.582031 0 Z" />
        </g>
      </g>

      <ellipse className="dm-shadow dm-s1" cx="75.22" cy="69" rx="5.5" ry="2" fill={shadowFill} />
      <ellipse className="dm-shadow dm-s2" cx="141.87" cy="69" rx="5.5" ry="2" fill={shadowFill} />
      <ellipse className="dm-shadow dm-s3" cx="160.94" cy="69" rx="5.5" ry="2" fill={shadowFill} />

      <circle className="dm-dot dm-d1" cx="75.22" cy="64.32" r="6.2" fill={fill} />
      <circle className="dm-dot dm-d2" cx="141.87" cy="64.32" r="6.2" fill={fill} />
      <circle className="dm-dot dm-d3" cx="160.94" cy="64.32" r="6.2" fill={fill} />
    </svg>
  )
}
