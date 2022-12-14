import { useContext } from "react"
import GlobalContext from "../context/GlobalContext"
import { colors } from "../utils/enums";

const useDarkMode = () => {
  const { darkTheme, setDarkTheme } = useContext(GlobalContext);

  const toggleTheme = () => setDarkTheme(!darkTheme);
  const textColor = darkTheme ? colors.darkTheme.text : colors.lightTheme.text;
  const backgroundColor = darkTheme ? colors.darkTheme.background : colors.lightTheme.background;
  const themeIcon = darkTheme ? colors.darkTheme.themeIcon : colors.lightTheme.themeIcon;
  const inputBg = darkTheme ? colors.darkTheme.input.background : colors.lightTheme.input.background;
  const placeholderColor = darkTheme ? colors.darkTheme.input.placeholder : colors.lightTheme.input.placeholder;
  const dividerColor = darkTheme ? colors.darkTheme.divider : colors.lightTheme.divider;
  const surfaceColor = darkTheme ? colors.darkTheme.surface : colors.lightTheme.surface;
  const secondaryText = darkTheme ? colors.darkTheme.secondaryText : colors.lightTheme.secondaryText;
  const mapStyle = darkTheme ? colors.darkTheme.mapStyle: colors.lightTheme.mapStyle;
  const errorInputBg = darkTheme ? colors.darkTheme.input.error : colors.lightTheme.input.error;

  return { color: textColor, backgroundColor, toggleTheme, themeIcon, inputBg, placeholderColor, dividerColor, surfaceColor, secondaryText, mapStyle, errorInputBg };
}

export default useDarkMode;