module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        accent: '#FF6B9D', // baby pink
        'baby-blue': '#87CEEB',
        'baby-yellow': '#FFFACD',
        'baby-green': '#98FB98',
        'baby-pink': '#FFB6C1',
        'baby-purple': '#E6E6FA',
        'text-primary': '#2D3748',
        'text-secondary': '#718096',
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      }
    }
  },
  plugins: []
}
