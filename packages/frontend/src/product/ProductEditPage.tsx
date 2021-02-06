import {
  CircularProgress,
  createStyles,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  withStyles
} from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import TitledHeader from '../common/TitledHeader';
import Product from './interfaces/Product';
import ProductForm from './ProductForm';
import { ProductProviderContext } from './ProductProvider';

const styles = createStyles({});

interface RouteParams {
  product: string;
}

interface Props extends RouteComponentProps<RouteParams>, WithStyles<typeof styles> {}

interface State {
  product?: Product;
  menuAnchor?: Element;
}

class ProductEditPage extends Component<Props, State> {
  static contextType = ProductProviderContext;
  context!: React.ContextType<typeof ProductProviderContext>;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.context.getProduct(Number(this.props.match.params.product)).then((product) => {
      this.setState({ product });
    });
  }

  private saveProduct(productData: Partial<Product>) {
    this.context.saveProduct(this.state.product.id, productData).then((product) => {
      this.props.history.goBack();
    });
  }

  private deleteProduct() {
    this.context.deleteProduct(this.state.product.id).then(() => {
      this.props.history.goBack();
    });
  }

  private handleCloseMenu(): void {
    this.setState({ menuAnchor: undefined });
  }

  render() {
    const { classes } = this.props;
    let anchorEl;

    return (
      <React.Fragment>
        <TitledHeader
          title={'Editar produto'}
          onClose={() => this.props.history.goBack()}
          icons={
            <React.Fragment>
              <IconButton
                color="inherit"
                onClick={(event) => {
                  this.setState({ menuAnchor: event.currentTarget });
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                keepMounted
                anchorEl={this.state.menuAnchor}
                open={Boolean(this.state.menuAnchor)}
                onClose={() => this.handleCloseMenu()}
              >
                <MenuItem
                  onClick={() => {
                    this.deleteProduct();
                    this.handleCloseMenu();
                  }}
                >
                  Excluir produto
                </MenuItem>
              </Menu>
            </React.Fragment>
          }
        />
        {this.state.product ? (
          <ProductForm
            product={this.state.product}
            onSubmit={(formData) => this.saveProduct(formData)}
          />
        ) : (
          <LinearProgress />
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProductEditPage);
