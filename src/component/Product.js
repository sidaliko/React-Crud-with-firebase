import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Fragment } from "react";
import { updateDoc } from "firebase/firestore";

import CancelIcon from "@mui/icons-material/Cancel";

import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";
function Product() {
  const [products, setProducts] = useState([]);

  const [editStates, setEditStates] = useState({});
  const productsCollectionRef = collection(db, "products");

  const [newCode, setNewCode] = useState("");
  const [newPrice, setNewPrice] = useState();

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProducts();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
      description: "Product ID",
      sortable: false,
      flex: 1,
    },
    {
      field: "code",
      headerName: "Code",
      width: 120,
      sortable: false,
      description: "Product Code",
      editable: true,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      description: "Product Price",
      editable: true,
      flex: 1,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      sortable: false,
      flex: 1,
      renderCell: (params) =>
        editStates[params.row.id] === true ? (
          <>
            <IconButton
              aria-label={"edit"}
              onClick={() => handleConfirmEdit(params.row)}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              aria-label={"edit"}
              onClick={() => handleCloseEdit(params.row)}
            >
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            aria-label={"edit"}
            onClick={() => {
              handleOpenEdit(params.row);
              // handleEditCell();
            }}
          >
            <EditIcon />
          </IconButton>
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          aria-label="delete"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const addProduct = async () => {
    await addDoc(productsCollectionRef, {
      code: newCode,
      price: newPrice,
    });

    const data = await getDocs(productsCollectionRef);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    setNewCode("");
    setNewPrice("");
  };

  const handleOpenEdit = (row) => {
    setEditStates(() => ({ [row.id]: true }));
  };
  const handleCloseEdit = (row) => {
    setEditStates(() => ({ [row.id]: false }));
  };

  const handleConfirmEdit = (row) => {
    setEditStates(() => ({ [row.id]: false }));

    const docReff = doc(db, "products", row.id);
    updateDoc(docReff, { code: row.code, price: row.price });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (confirmed) {
      const docRef = doc(db, "products", id);
      deleteDoc(docRef)
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.filter((client) => client.id !== id)
          );
          window.alert("Product Deleted");
        })
        .catch((error) => {
          console.error("Error removing product: ", error);
        });
    }
  };

  return (
    <Fragment>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch", marginTop: "20px" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Code"
          value={newCode}
          required
          variant="outlined"
          onChange={(e) => {
            setNewCode(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Price"
          value={newPrice}
          required
          variant="outlined"
          type="number"
          onChange={(e) => {
            setNewPrice(e.target.value);
          }}
        />

        <Button variant="contained" color="primary" onClick={addProduct}>
          Add Product
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          pagination
          editMode="cell"
          disableSelectionOnClick
        />
      </div>
    </Fragment>
  );
}

export default Product;
