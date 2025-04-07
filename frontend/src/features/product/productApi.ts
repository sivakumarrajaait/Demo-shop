import { Product } from "./productSlice";
import { getProducts, createProduct, updateProduct, deleteProduct, filterProduct, getSingleProduct } from "../../api/product";
export type ProductFilter = {
  name?: string;
  stock?: number;
  createdOn?: string; 
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await getProducts();
  return response.data.result; 
};
export const fetchSingleProducts = async (id: string): Promise<Product> => {
    const response = await getSingleProduct(id);
    return response.data.result; 
  };

  export type CreateProductPayload = Omit<Product, "_id" | "createdOn">;


 export const createProductAPI = async (product: CreateProductPayload): Promise<Product> => {
  const response = await createProduct(product);
  return response.data.result;
};

export type UpdateProductPayload = Omit<Product, "_id"|"createdOn">;
export const updateProductAPI = async (product: UpdateProductPayload): Promise<Product> => {
  const response = await updateProduct(product);
  return response.data.result;
};


export const deleteProductAPI = async (id: string): Promise<void> => {
  await deleteProduct(id);
};

export const filterProductAPI = async (product: ProductFilter): Promise<Product[]> => {
  const filterParams = {
    name: product.name,
    createdOn: product.createdOn,
    stock:product.stock
  };

  const response = await filterProduct(filterParams);
  return response.data.result;
  };
