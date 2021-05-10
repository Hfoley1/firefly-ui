import React from 'react';
import { IconButton, Hidden, makeStyles, Box } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const LOGO_URL = '/img/ff-logo.svg';

type Props = {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HiddenAppBar: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  const classes = useStyles();

  return (
    <Hidden implementation="css" mdUp>
      <Box className={classes.container}>
        <div className={classes.item}>
          <IconButton
            className={classes.marginRight}
            size="small"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <MenuIcon />
          </IconButton>
          <img height="33" src={LOGO_URL} alt="" />
        </div>
      </Box>
    </Hidden>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 3),
    height: theme.mixins.toolbar.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
}));
