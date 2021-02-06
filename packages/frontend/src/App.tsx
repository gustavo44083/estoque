import { Container, createStyles, CssBaseline, Snackbar, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import ProductAddPage from './product/ProductAddPage';
import ProductEditPage from './product/ProductEditPage';
import ProductListPage from './product/ProductListPage';
import ProductProvider from './product/ProductProvider';

const styles = createStyles({
  productList: {
    paddingTop: 88
  }
});

interface State {
  snackbarMessage?: string;
}

class App extends Component<any, State> {
  routerRef = React.createRef<BrowserRouter>();

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  private openSnackbar(message: string) {
    this.setState({ snackbarMessage: message });
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <ProductProvider>
            <BrowserRouter ref={this.routerRef}>
              <Switch>
                <Route exact path="/" component={ProductListPage} />
                <Route path="/products/:product" component={ProductEditPage} />
                <Route path="/add" component={ProductAddPage} />
              </Switch>
            </BrowserRouter>
          </ProductProvider>
        </Container>
        <Snackbar
          message={this.state.snackbarMessage}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={!!this.state.snackbarMessage}
          onClose={() => this.setState({ snackbarMessage: undefined })}
          autoHideDuration={6000}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
