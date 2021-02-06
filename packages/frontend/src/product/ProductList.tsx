import {
  Box,
  Checkbox,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import React, { Component } from 'react';
import Product from './interfaces/Product';
import { ProductProviderContext } from './ProductProvider';
import InfiniteScroll from 'react-infinite-scroller';

interface State {
  search: string;
  products?: Product[];
  checked: Set<number>;
  hasMore?: boolean;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  search?: string;
  onProductClick?: (product: Product) => void;
  onCheckedChange?: (checked: Set<number>) => void;
}

export default class ProductList extends Component<Props, State> {
  static contextType = ProductProviderContext;
  context!: React.ContextType<typeof ProductProviderContext>;
  private infiniteScrollRef = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    this.state = {
      search: props.search,
      checked: new Set()
    };
  }

  componentDidMount() {
    this.queryProducts();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (prevProps.search !== this.props.search) {
      const infiniteScroll = this.infiniteScrollRef.current;
      if (infiniteScroll) {
        infiniteScroll.pageLoaded = 0;
      }

      this.setState({ search: this.props.search, hasMore: true, products: [] });
      this.queryProducts()
    }
  }

  private queryProducts(page: number = 0) {
    const limit = 20;
    this.context.getProducts(page, limit, this.props.search).then((products) => {
      let productList: Product[] = products;
      if (page !== 0) {
        productList = this.state.products.concat(products);
      }

      this.setState({
        products: productList,
        hasMore: products.length == limit
      });
    });
  }

  removeDeleted(ids: Iterable<number>) {
    const idArray = Array.from(ids);
    const products = this.state.products.filter((product) => !idArray.includes(product.id));

    const newChecked = new Set(this.state.checked);
    for (let id of Array.from(ids)) {
      newChecked.delete(id);
    }

    this.setState({ products, checked: newChecked });
  }

  private handleProductClick(product: Product) {
    if (this.props.onProductClick) {
      this.props.onProductClick(product);
    }
  }

  render() {
    if (!this.state.products) {
      return <LinearProgress />;
    }

    if (!this.state.products.length) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ padding: '24px' }}>Nenhum produto {this.state.search ? 'encontrado' : 'cadastrado'} :(</span>
        </div>
      );
    }

    return (
      <List>
        <InfiniteScroll
          ref={this.infiniteScrollRef}
          pageStart={0}
          loadMore={(page) => this.queryProducts(page)}
          hasMore={this.state.hasMore}
          loader={<LinearProgress key={'loader'} />}
        >
          {this.state.products.map((product) => (
            <ListItem button key={product.id}>
              <ListItemText
                key={product.id}
                primary={product.title}
                secondary={`${product.stock} unidades disponíveis`}
                onClick={() => this.handleProductClick(product)}
              />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={this.state.checked.has(product.id)}
                  onChange={(event, checked) => {
                    const checkedSet = new Set(this.state.checked);
                    if (checked) {
                      checkedSet.add(product.id);
                    } else {
                      checkedSet.delete(product.id);
                    }

                    this.setState({ checked: checkedSet });
                    if (this.props.onCheckedChange) {
                      this.props.onCheckedChange(checkedSet);
                    }
                  }}
                  // checked={checked.indexOf(value) !== -1}
                  // inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </InfiniteScroll>
      </List>
    );
  }
}
