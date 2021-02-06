import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { Component } from 'react';
import { AppBar, createStyles, IconButton, Toolbar, Typography, WithStyles, withStyles } from '@material-ui/core';

const styles = createStyles({
  grow: {
    flexGrow: 1
  }
});

interface Props extends WithStyles<typeof styles> {
  title: string
  onClose?: () => void
  icons?: React.ReactNode
}

class TitledHeader extends Component<Props, any> {
  render() {
    const { classes } = this.props;
  
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={this.props.onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">{this.props.title}</Typography>
          <div className={classes.grow} />
          {this.props.icons}
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(TitledHeader);
