import { createMuiTheme } from '@material-ui/core/styles';
import themeData from './theme.json';

const themeName = 'MFASA';
export default createMuiTheme({ ...themeData, themeName });
