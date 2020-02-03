import * as colors from '@ridi/colors';

export interface RIDITheme {
  backgroundColor: string;
  textColor: string;
  hoverBackground: string;
  dividerColor: string;
  dividerOpacity: number;
  placeholderColor: string;
  primaryColor: string;
  primaryHoverColor: string;
  secondaryColor: string;
  footerTextColor: string;
  horizontalRuleColor: string;
  verticalRuleColor: string;
  logoFilter: string;
  logoFilter2: string;
  button: {
    primaryBackground: string;
    secondaryBackground: string;
    primaryFontColor: string;
    primaryBorderColor: string;
    secondaryBorderColor: string;
    secondaryFontColor: string;
  };
  input: {
    placeholder: string;
  };
  divider: string;
  divider2: string;
  divider3: string;
  genreTab: {
    icon: string;
    normal: string;
    active: string;
  };
  subServiceTab: {
    normal: string;
    hover: string;
    active: string;
  };
  label: string;
  label2: string;
  label3: string;
  etc: {
    slot1: string;
  };
  icon: {
    warn: string;
  };
  quickMenu: {
    label: string;
  };
  instantSearch: {
    itemHover: string;
  };
  image: {
    border: string;
  };
}

export const defaultTheme: RIDITheme = {
  backgroundColor: '#ffffff',
  textColor: '#303538',
  hoverBackground: '#F7FAFC',
  dividerColor: '#E6E8EB',
  dividerOpacity: 1,
  placeholderColor:
    'linear-gradient(326.23deg, #F8F9FB 1.42%, #F1F1F3 49.17%, #F8F9FB 100%)',
  primaryColor: colors.dodgerBlue50,
  primaryHoverColor: colors.dodgerBlue10,
  secondaryColor: colors.slateGray90,
  footerTextColor: '#ffffff',
  horizontalRuleColor: colors.slateGray80,
  verticalRuleColor: colors.slateGray70,
  logoFilter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.3))',
  logoFilter2: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))',
  button: {
    primaryBorderColor: colors.dodgerBlue20,
    primaryBackground: colors.dodgerBlue50,
    primaryFontColor: '#ffffff',
    secondaryBackground: '#ffffff',
    secondaryBorderColor: '#ffffff',
    secondaryFontColor: colors.dodgerBlue50,
  },
  input: {
    placeholder: colors.slateGray50,
  },
  divider: colors.slateGray5,
  divider2: colors.slateGray10,
  divider3: colors.slateGray20,
  label: colors.slateGray40,
  label2: colors.slateGray50,
  label3: colors.slateGray80,
  genreTab: {
    icon: colors.slateGray60,
    normal: colors.slateGray80,
    active: colors.dodgerBlue50,
  },
  subServiceTab: {
    normal: colors.slateGray50,
    hover: colors.slateGray90,
    active: colors.dodgerBlue50,
  },
  etc: {
    slot1: colors.slateGray20,
  },
  icon: {
    warn: colors.slateGray20,
  },
  quickMenu: {
    label: colors.slateGray70,
  },
  instantSearch: {
    itemHover: colors.lightSteelBlue5,
  },
  image: {
    border: colors.slateGray30,
  },
};

export const darkTheme: RIDITheme = {
  backgroundColor: '#212B3B',
  textColor: '#ffffff',
  hoverBackground: '#2E3847',
  dividerColor: '#ffffff',
  dividerOpacity: 0.08,
  placeholderColor: 'linear-gradient(90.3deg, #263041 0%, #242E3F 49.48%, #263041 100%)',
  primaryColor: colors.gray90,
  primaryHoverColor: colors.dodgerBlue10,
  secondaryColor: colors.slateGray90,
  footerTextColor: '#ffffff',
  horizontalRuleColor: colors.slateGray80,
  verticalRuleColor: colors.slateGray70,
  logoFilter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.3))',
  logoFilter2: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))',
  button: {
    primaryBorderColor: colors.dodgerBlue20,
    primaryBackground: colors.dodgerBlue50,
    primaryFontColor: '#ffffff',
    secondaryBackground: '#ffffff',
    secondaryBorderColor: '#ffffff',
    secondaryFontColor: colors.dodgerBlue50,
  },
  input: {
    placeholder: colors.slateGray50,
  },
  divider: colors.slateGray5,
  divider2: colors.slateGray10,
  divider3: colors.slateGray20,
  genreTab: {
    icon: colors.slateGray60,
    normal: colors.slateGray80,
    active: colors.dodgerBlue50,
  },
  subServiceTab: {
    normal: colors.slateGray50,
    hover: colors.slateGray90,
    active: colors.dodgerBlue50,
  },
  label: colors.slateGray40,
  label2: colors.slateGray50,
  label3: colors.slateGray80,
  etc: {
    slot1: colors.slateGray20,
  },
  icon: {
    warn: colors.slateGray20,
  },
  quickMenu: {
    label: colors.slateGray70,
  },
  instantSearch: {
    itemHover: colors.lightSteelBlue5,
  },
  image: {
    border: colors.slateGray30,
  },
};
