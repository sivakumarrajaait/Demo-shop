import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleProducts } from "../../../features/product/productApi";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export interface Product {
  _id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  isDeleted?: boolean;
  status?: number;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}
const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (id) {
          const data = await fetchSingleProducts(id);
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Small Back Button */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/product")}
        sx={{ mb: 2 }}
        
      >
        Back to Products
      </Button>

      <Typography variant="h4" gutterBottom textAlign="center">
        Product Details
      </Typography>

      <Grid container justifyContent="center">
  <Paper
    elevation={4}
    sx={{
      borderRadius: 4,
      overflow: "hidden",
      maxWidth: 500, 
      width: "100%",
    }}
  >
    <Card>
      {product.image && (
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            height: 250,
            objectFit: "cover",
          }}
        />
      )}
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {product.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          {product.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          💰 Price: ${product.price}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          📦 Stock: {product.stock}
        </Typography>
      </CardContent>
    </Card>
  </Paper>
</Grid>

    </Box>
  );
};

export default ProductView;
