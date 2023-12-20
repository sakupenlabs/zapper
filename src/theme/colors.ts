// Based mostly on https://github.com/Uniswap/interface/blob/main/src/theme/index.tsx

const colors = {
  white: '#FFFFFF',
  black: '#000000',

  error_dark: '#ff0030',

  neutral1_dark: '#f7f7f7',
}

const commonTheme = {
  white: colors.white,
  black: colors.black,
}

export const darkTheme = {
  ...commonTheme,

  bg1: colors.black,

  neutral1: colors.neutral1_dark,
  error: colors.error_dark,
}
