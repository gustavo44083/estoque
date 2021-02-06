import { createStyles, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import ActivityPageProps from '../common/interfaces/ActivityPageProps';
import TitledHeader from '../common/TitledHeader';
import Product from './interfaces/Product';
import ProductForm from './ProductForm';
import ProductProvider, { ProductProviderContext } from './ProductProvider';

const styles = createStyles({});

interface Props extends RouteComponentProps, WithStyles<typeof styles> {}

class ProductAddPage extends Component<Props, any> {
  static contextType = ProductProviderContext;
  context!: React.ContextType<typeof ProductProviderContext>;

  private saveProduct(productData: Partial<Product>) {
    this.context.createProduct(productData).then((product) => {
      this.props.history.goBack();
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <TitledHeader title={'Cadastrar produto'} onClose={() => this.props.history.goBack()} />
        <ProductForm onSubmit={formData => this.saveProduct(formData)} />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProductAddPage);
