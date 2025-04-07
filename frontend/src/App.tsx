import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { JSX, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import { isAuthenticated } from "./utils/auth";
import ProductList from "./pages/product/product";
import ProductPost from "./pages/product/productPost.tsx/productPost";
import ProductEdit from "./pages/product/productEdit.tsx/productEdit";
import ProductView from "./pages/product/productView.tsx/productView";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You are not logged in!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, []);

  return isAuthenticated() ? element : <Navigate to="/" replace />;
};


const Layout = () => <Outlet />;


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/product",
    element: <ProtectedRoute element={<ProductList />} />,
  },
  {
    path: "/product",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      { index: true, element: <ProductList /> },
      { path: "create", element: <ProtectedRoute element={<ProductPost />} /> },
    ],
  },
  {
    path: "/product",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      { index: true, element: <ProductList /> },
      { path: "edit/:id", element: <ProtectedRoute element={<ProductEdit />} /> },
    ],
  },
  {
    path: "/product",
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      { index: true, element: <ProductList /> },
      { path: "view/:id", element: <ProtectedRoute element={<ProductView />} /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}
