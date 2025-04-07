import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdOn: Date;
  image: string;

}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    getsingleProduct(state, action: PayloadAction<string>) {
      const product = state.products.find((p) => p._id === action.payload);
      state.selectedProduct = product ?? null;
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) state.products[index] = action.payload;
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    filterProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  getsingleProduct,
  updateProduct,
  deleteProduct,
  filterProducts,
} = productSlice.actions;

export default productSlice.reducer;
