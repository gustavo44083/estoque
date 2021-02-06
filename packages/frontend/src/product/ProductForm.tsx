import { Button, createStyles, TextField, WithStyles, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Product from './interfaces/Product';

const styles = createStyles({
  form: {
    paddingTop: 32,
    '& .MuiFormControl-root': {
      paddingBottom: 24,
      width: '100%'
    }
  },
  saveButton: {
    float: 'right'
  }
});

interface Props extends WithStyles<typeof styles> {
  product?: Product;
  onSubmit: (formData: Partial<Product>) => void;
}

interface State {}

class ProductForm extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const product = this.props.product || ({} as any);

    return (
      <React.Fragment>
        <form className={classes.form} onSubmit={(event) => this.onSubmit(event)}>
          <TextField
            name="title"
            variant="filled"
            label="Nome"
            defaultValue={product.title}
            required
          />
          <TextField name="sku" variant="filled" label="SKU" defaultValue={product.sku} required />
          <TextField
            name="stock"
            variant="filled"
            label="Estoque"
            type="number"
            defaultValue={product.stock}
          />
          <Button type="submit" variant="contained" color="primary" className={classes.saveButton}>
            Salvar
          </Button>
        </form>
      </React.Fragment>
    );
  }

  private onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = Array.from(event.currentTarget.querySelectorAll('input'))
      .map((i) => ({
        name: i.name,
        value: this.parseValue(i)
      }))
      .filter((obj) => obj.value)
      .reduce((map, obj) => {
        map[obj.name] = obj.value;
        return map;
      }, {} as any);

    this.setState({ snackbarOpen: true });
    this.props.onSubmit(formData);
  }

  private parseValue(input: HTMLInputElement): any {
    switch (input.type) {
      case 'number':
        return Number(input.value);
      default:
        return input.value;
    }
  }
}

export default withStyles(styles)(ProductForm);
