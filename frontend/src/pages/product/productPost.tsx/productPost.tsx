import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { createProductAPI } from "../../../features/product/productApi";
import { getUserId } from "../../../utils/storage";
import { uploadSingleFile } from "../../../utils/fileUpload";
import { addProduct } from "../../../features/product/productSlice";


type InputState = {
  userId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
};

type FieldError = {
  required: boolean;
  valid?: boolean;
};

type ErrorState = {
  userId: FieldError;
  name: FieldError;
  description: FieldError;
  price: FieldError;
  stock: FieldError;
  image: FieldError;
};


const initialInputs: InputState = {

  userId: getUserId() || "",
  name: "",
  description: "",
  price: 0,
  stock: 0,
  image: "",
};

const initialErrors: ErrorState = {
  userId: { required: false },
  name: { required: false },
  description: { required: false },
  price: { required: false },
  stock: { required: false },
  image: { required: false },
};

const ProductPost = () => {
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleValidation = (data: InputState) => {
    const error = { ...initialErrors };

    if (!data.userId) error.userId.required = true;
    if (!data.name) error.name.required = true;
    if (!data.description) error.description.required = true;
    if (!data.price) error.price.required = true;
    if (!data.stock) error.stock.required = true;
    if (!data.image) error.image.required = true;

    return error;
  };

  const handleErrors = (obj: ErrorState) => {
    for (const key in obj) {
      const prop = obj[key as keyof ErrorState];
      if (prop.required || prop.valid) return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));

    if (submitted) {
      const newErrors = handleValidation({
        ...inputs,
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      });
      setErrors(newErrors);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadSingleFile(file);
      console.log("url",url);
      if (typeof url === "string") {
        setInputs((prev) => ({ ...prev, image: url }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = handleValidation(inputs);
    setErrors(validationErrors);

    if (handleErrors(validationErrors)) {
        try {
            const newProduct = await createProductAPI(inputs);
            dispatch(addProduct(newProduct));
            toast.success("Product created successfully");
            navigate("/product");
           
          }  catch (err: unknown) {
                      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
                      toast.error(errorMessage);
                    }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
      <Button
  variant="text"
  onClick={() => navigate("/product")}
  sx={{ mb: 2, fontSize: "0.9rem", color: "white", bgcolor:'blue' }}
>
  ← Back to Products
</Button>
        <Typography variant="h5" mb={3} fontWeight="bold" color="primary">
          Post a Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            margin="normal"
            required
            error={errors.name.required}
            helperText={errors.name.required && "Product name is required"}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={inputs.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
            error={errors.description.required}
            helperText={
              errors.description.required && "Description is required"
            }
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={inputs.price}
            onChange={handleChange}
            margin="normal"
            required
            error={errors.price.required}
            helperText={errors.price.required && "Price is required"}
          />
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={inputs.stock}
            onChange={handleChange}
            margin="normal"
            required
            error={errors.stock.required}
            helperText={errors.stock.required && "Stock is required"}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={inputs.image}
            onChange={handleChange}
            margin="normal"
            required
            error={errors.image.required}
            helperText={errors.image.required && "Image URL is required"}
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit Product
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductPost;
