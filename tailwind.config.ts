import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define 'General Sans' como a fonte padrão para a classe 'font-sans'
        sans: ['"General Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
