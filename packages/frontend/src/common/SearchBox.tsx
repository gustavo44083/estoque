import { createStyles, InputAdornment, TextField, WithStyles, withStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { Component } from 'react';

interface State {}

const styles = createStyles({
  root: {
    display: 'flex',
    width: '100%'
  },
  textField: {
    flexGrow: 1
  },
  inputRoot: {
    borderRadius: 4,
    padding: '16px 12px'
  },
  input: {
    padding: 0
  },
  icon: {
    marginTop: '0px !important'
  }
});

export interface Props extends WithStyles<typeof styles> {
  onChange?: (searchTerm: string) => void;
}

class SearchBox extends Component<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          variant="filled"
          classes={{ root: classes.textField }}
          onChange={(event) => {
            console.log(this.props)
            return this.props.onChange ? this.props.onChange(event.target.value) : null;
          }}
          InputProps={{
            classes: { root: classes.inputRoot, input: classes.input },
            disableUnderline: true,
            placeholder: 'Pesquise por produtos',
            startAdornment: (
              <InputAdornment position="start" className={classes.icon}>
                <Search />
              </InputAdornment>
            )
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SearchBox);
