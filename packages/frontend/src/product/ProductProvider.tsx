import React, { Component } from 'react';
import Product from './interfaces/Product';

export const ProductProviderContext = React.createContext<ProductProvider | undefined>(undefined);

export default class ProductProvider extends Component<any, any> {
  endpoint = `${process.env.REACT_APP_BACKEND}/api/v1`;

  async getProducts(page: number, limit: number, search: string = ''): Promise<Product[]> {
    const response = await fetch(
      `${this.endpoint}/products?page=${page}&limit=${limit}&search=${search}`
    ).then(this.handleErrors);

    const data = await response.json();
    return data.products;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.request(`${this.endpoint}/products/${id}`);
    return response.json();
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const response = await this.request(`${this.endpoint}/products`, 'POST', product);
    return response.json();
  }

  async saveProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await this.request(`${this.endpoint}/products/${id}`, 'PUT', product);
    return response.json();
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`${this.endpoint}/products/${id}`, 'DELETE');
  }

  async deleteManyProducts(ids: number[]): Promise<number> {
    const response = await this.request(`${this.endpoint}/products`, 'DELETE', { ids });
    const data = await response.json();
    return data.deleted;
  }

  private async request(url: string, method?: string, data?: any) {
    let init: RequestInit = { method: method || 'GET' };
    if (data) {
      init = {
        ...init,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
    }

    return fetch(url, init).then(this.handleErrors);
  }

  private async handleErrors(response: Response): Promise<Response> {
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response;
  }

  render() {
    return (
      <ProductProviderContext.Provider value={this}>
        {this.props.children}
      </ProductProviderContext.Provider>
    );
  }
}
