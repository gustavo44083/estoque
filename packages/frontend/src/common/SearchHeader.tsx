import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import SearchBox from './SearchBox';
import { Props as SearchBoxProps } from './SearchBox';

const styles = (theme: Theme) =>
  createStyles({
    header: {
      position: 'sticky',
      overflow: 'hidden',
      top: 0,
      backgroundColor: theme.palette.background.default,
      zIndex: 1
    },
    search: {
      padding: 16
    }
  });

interface Props extends WithStyles<typeof styles> {
  searchBoxProps?: Partial<SearchBoxProps>;
}

class SearchHeader extends Component<Props, any> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.header} data-section="Search">
        <SearchBox {...this.props.searchBoxProps} classes={{ root: classes.search }} />
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(styles)(SearchHeader);
