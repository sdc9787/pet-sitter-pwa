/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#569bf6",
        gray: "#575759",
        bdgray: "#efefef",
      },
      fontFamily: {
        custom: ["Noto Sans KR", "Roboto", "sans-serif"],
      },
      boxShadow: {
        topbar: "0px 2px 6px -6px #666",
        button: "rgba(0, 0, 0, 0.24) 0px 0px 5px;",
      },
      gridTemplateColumns: {
        community: "repeat(5, 1.5fr)",
      },
      gridTemplateRows: {
        community: "30px 45px 30px",
      },
      lineHeight: {
        tight: "1.2",
      },
      letterSpacing: {
        wider: "1px",
      },
      fontSize: {
        sm: "13px",
      },
    },
    corePlugins: {
      // ...

      preflight: true,
    },
  },
  plugins: [],
};
