import { createStyles, Fab, IconButton, Typography, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import SearchHeader from '../common/SearchHeader';
import ProductList from './ProductList';
import { ProductProviderContext } from './ProductProvider';

const styles = createStyles({
  productList: {
    paddingTop: 88
  },
  fab: {
    position: 'fixed',
    right: 16,
    bottom: 16
  },
  selectionMenu: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-subtitle2': {
      padding: 16
    }
  },
  grow: {
    flexGrow: 1
  }
});

interface Props extends RouteComponentProps, WithStyles<typeof styles> {}

interface State {
  checked?: Set<number>;
  searchTerm?: string;
}

class ProductListPage extends Component<Props, State> {
  static contextType = ProductProviderContext;
  context!: React.ContextType<typeof ProductProviderContext>;
  private productListRef = React.createRef<ProductList>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private handleBatchDelete() {
    const ids = this.state.checked;
    this.context.deleteManyProducts(Array.from(ids)).then((deletedCount) => {
      this.productListRef.current.removeDeleted(ids);
      this.setState({ checked: undefined });
    });
  }

  private handleSearch(searchTerm: string) {
    this.setState({ searchTerm });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <SearchHeader
          searchBoxProps={{
            onChange: (searchTerm) => this.handleSearch(searchTerm)
          }}
        >
          {this.state.checked?.size ? (
            <div className={classes.selectionMenu}>
              <Typography variant="subtitle2">{this.state.checked?.size} selecionados</Typography>
              <div className={classes.grow} />
              <IconButton onClick={() => this.handleBatchDelete()}>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : null}
        </SearchHeader>
        <ProductList
          ref={this.productListRef}
          className={classes.productList}
          search={this.state.searchTerm}
          onProductClick={(product) => this.props.history.push(`/products/${product.id}`)}
          onCheckedChange={(checked) => this.setState({ checked })}
        />
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={() => this.props.history.push('/add')}
        >
          <AddIcon />
        </Fab>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProductListPage);
