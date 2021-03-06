import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Icon from '@mdi/react'
import {
  mdiChartBellCurveCumulative,
  mdiChartSnakeyVariant,
  mdiTagMultiple,
  mdiFileDocumentBoxCheckOutline
} from '@mdi/js'
import Logo from '../Logo/index'
import LoginButton from '../LoginButton'
import LinkTo from '../LinkTo'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 70
  },
  header: {
    zIndex: theme.zIndex.drawer + 1
  },
  menu: {
    textAlign: 'center'
  },
  popper: {
    zIndex: theme.zIndex.drawer + 1,
    display: 'flex'
  }
}))

const Header = ({ children, match }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const buttonColourFor = (path) => {
    let paths = path
    if (typeof path === 'string') {
      paths = [paths]
    }
    const matched = paths.reduce((res, p) => (
      res || match.path.startsWith(p)
    ), false)
    return matched ? 'secondary' : 'inherit'
  }

  const handleClick = (event) => {
    const { currentTarget } = event
    setAnchorEl(currentTarget)
    setOpen(!open)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.header}>
        <Toolbar>
          <Grid container>
            <Grid item xs={3}>
              <Logo />
            </Grid>
            <Grid item xs={6} className={classes.menu}>
              <Button
                color={buttonColourFor('/dashboard')}
                component={LinkTo('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                color={buttonColourFor('/budget')}
                aria-owns={open ? 'budget-menu-list-grow' : null}
                onClick={handleClick}
              >
                Budget
                <ArrowDropDownIcon />
              </Button>
              {anchorEl !== null && (
                <Popper
                  open={open}
                  anchorEl={anchorEl}
                  transition
                  className={classes.popper}
                  placement="bottom-start"
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList role="menu">
                            <MenuItem onClick={handleClose} component={LinkTo('/money-flow')}>
                              <ListItemIcon>
                                <Icon path={mdiChartSnakeyVariant} size={1} color="rgba(0, 0, 0, 0.54)" />
                              </ListItemIcon>
                              <ListItemText primary="Money flow" />
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={LinkTo('/budget')}>
                              <ListItemIcon>
                                <Icon path={mdiChartBellCurveCumulative} size={1} color="rgba(0, 0, 0, 0.54)" />
                              </ListItemIcon>
                              <ListItemText primary="History" />
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={LinkTo('/trial-balance')}>
                              <ListItemIcon>
                                <Icon path={mdiFileDocumentBoxCheckOutline} size={1} color="rgba(0, 0, 0, 0.54)" />
                              </ListItemIcon>
                              <ListItemText primary="Trial Balance" />
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={LinkTo('/budget-categories')}>
                              <ListItemIcon>
                                <Icon path={mdiTagMultiple} size={1} color="rgba(0, 0, 0, 0.54)" />
                              </ListItemIcon>
                              <ListItemText primary="Categories" />
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              )}
            </Grid>
            <Grid item xs={3}>
              <LoginButton />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      { children }
    </div>
  )
}

Header.propTypes = {
  children: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default Header
