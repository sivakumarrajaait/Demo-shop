import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  setProducts,
  deleteProduct,
  filterProducts,
} from "../../features/product/productSlice";
import {
  fetchProducts,
  deleteProductAPI,
  filterProductAPI,
} from "../../features/product/productApi";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { isValidDate } from "../../utils/validation";
import { toast } from "react-toastify";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const products = useSelector((state: RootState) => state.product.products || []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        dispatch(setProducts(response));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    loadProducts();
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteProductAPI(selectedId);
      dispatch(deleteProduct(selectedId));
      handleMenuClose();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = () => {
    if (selectedId) {
      navigate(`/product/edit/${selectedId}`);
      handleMenuClose();
    }
  };

  const handleView = () => {
    if (selectedId) {
      navigate(`/product/view/${selectedId}`);
      handleMenuClose();
    }
  };

  const handleFilter = async () => {
    try {
      const term = searchTerm.trim();
      if (!term) return;
  
      const filter: { name?: string; stock?: number; createdOn?: string } = {};


      const isDate = isValidDate(term);
    const isNumber = !isNaN(Number(term));

    if (isDate) {
      filter.createdOn = term;
    } else if (isNumber) {
      filter.stock = Number(term);
    } else {
      filter.name = term;
    }
      const filtered = await filterProductAPI(filter);
      dispatch(filterProducts(filtered));
    } catch (error) {
      console.error("Filtering failed:", error);
    }
  };
  
  

  const handleClearFilter = async () => {
    setSearchTerm("");
    try {
      const all = await fetchProducts();
      dispatch(setProducts(all));
    } catch (error) {
      console.error("Failed to fetch all products:", error);
    }
  };

  return (
 <>
  <Header />

  <Box sx={{ p: { xs: 2, md: 4 } }}>
    <Typography variant="h4" gutterBottom align="center">
      Product List
    </Typography>

    <Box className="flex justify-center mb-4">
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/product/create")}
      >
        Add Product
      </Button>
    </Box>

    {/* Filter Section */}
    <Box
      className="flex flex-col md:flex-row gap-2 mb-4"
      sx={{ alignItems: { xs: "stretch", md: "center" } }}
    >
      <TextField
        fullWidth
        label="Search (Name, Stock, Date)"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="outlined" onClick={handleFilter}>
        Search
      </Button>
      <Button variant="text" color="secondary" onClick={handleClearFilter}>
        Clear
      </Button>
    </Box>

    {/* Table */}
    {products.length === 0 ? (
      <Typography variant="body1" align="center">
        No products available.
      </Typography>
    ) : (
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: "80px", maxHeight: "80px" }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, product._id)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    )}

    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={handleView}>View</MenuItem>
      <MenuItem onClick={handleEdit}>Edit</MenuItem>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>
  </Box>
</>

  );
};

export default ProductList;
