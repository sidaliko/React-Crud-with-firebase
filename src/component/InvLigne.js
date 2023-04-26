import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { useState, useEffect, Fragment } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";

import CancelIcon from "@mui/icons-material/Cancel";

import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";

const firebaseConfig = {
  apiKey: "AIzaSyDfwZqnbFSxSZQF6kXrb38DiPTep0vdV9A",
  authDomain: "crud-firebase-react-47288.firebaseapp.com",
  projectId: "crud-firebase-react-47288",
  storageBucket: "crud-firebase-react-47288.appspot.com",
  messagingSenderId: "681970979546",
  appId: "1:681970979546:web:d29214eb377bd9cdc14be3",
  measurementId: "G-VXVGR5Q63V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

function InvLigne() {
  const [invLigne, setInvLigne] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);

  const invoicesCollectionRef = collection(db, "invoices");
  const productsCollectionRef = collection(db, "products");

  const [newInvoiceKey, setNewInvoiceKey] = useState("");
  const [newProductCode, setNewProductCode] = useState();
  const [newQuantity, setNewQuantity] = useState();

  useEffect(() => {
    const getInvLigne = async () => {
      const data = await getDocs(invLigneRef);
      setInvLigne(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getInvLigne();
  }, []);

  useEffect(() => {
    const getInvoices = async () => {
      const data = await getDocs(invoicesCollectionRef);
      setInvoices(data.docs.map((doc) => doc.data().key));
    };
    getInvoices();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      const productsObject = data.docs.reduce((acc, doc) => {
        acc[doc.data().code] = doc.data().price;
        return acc;
      }, {});
      setProducts(productsObject);
    };
    getProducts();
  }, []);

  const [selectedInvOption, setSelectedInvOption] = useState("");
  const [selectedProductOption, setSelectedProductOption] = useState("");

  const handleInvOptionChange = (event) => {
    setSelectedInvOption(event.target.value);
    setNewInvoiceKey(event.target.value);
  };

  const handleProductOptionChange = (event) => {
    setSelectedProductOption(event.target.value);
    setNewProductCode(event.target.value);
  };

  // Create the invLigne collection with a composite primary key
  const invLigneRef = collection(db, "invLigne");

  const addInvLigne = async () => {
    await addDoc(invLigneRef, {
      invoiceKey: newInvoiceKey,
      productCode: newProductCode,
      quantity: newQuantity,
    });

    const data = await getDocs(invLigneRef);
    setInvLigne(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    setNewInvoiceKey("");
    setNewProductCode("");
    setNewQuantity("");
    setSelectedInvOption("");
    setSelectedProductOption("");
    setSelectedProductOption("");
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
      description: "ID",
      sortable: false,
      flex: 1,
    },
    {
      field: "invoiceKey",
      headerName: "Invoice Key",
      width: 120,

      flex: 1,
      editable: true,
    },
    {
      field: "productCode",
      headerName: "Product Code",
      width: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      type: "number",
      description: "Qauntity of product in invoice",
      flex: 1,
      editable: true,
    },
    {
      field: "cost",
      headerName: "Cost",
      sortable: false,
      description: "Cost",
      width: 200,
      flex: 1,

      renderCell: (params) =>
        `${products[params.row.productCode] * params.row.quantity}`,
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
  const [editStates, setEditStates] = useState({});

  const handleOpenEdit = (row) => {
    setEditStates(() => ({ [row.id]: true }));
  };
  const handleCloseEdit = (row) => {
    setEditStates(() => ({ [row.id]: false }));
  };

  const handleConfirmEdit = (row) => {
    setEditStates(() => ({ [row.id]: false }));
    const docReff = doc(db, "invLigne", row.id);
    updateDoc(docReff, {
      invoiceKey: row.invoiceKey,
      productCode: row.productCode,
      quantity: row.quantity,
    }).then(() => {});
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (confirmed) {
      const docRef = doc(db, "invLigne", id);
      deleteDoc(docRef)
        .then(() => {
          setInvLigne((prevInvLignes) =>
            prevInvLignes.filter((client) => client.id !== id)
          );
          window.alert("Invoice Ligne Deleted");
        })
        .catch((error) => {
          console.error("Error removing invoice ligne: ", error);
        });
    }
  };

  const rows = invLigne.map((invl) => ({
    ...invl,
    id: invl.id.toString(),
  }));
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
          label="Invoice Key"
          helperText="Please select your Invoice Key"
          required
          variant="outlined"
          select
          value={selectedInvOption}
          onChange={handleInvOptionChange}
          SelectProps={{
            displayEmpty: true,
          }}
        >
          {invoices.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-basic"
          label="Product Code"
          required
          helperText="Please select your Product Code"
          variant="outlined"
          select
          value={selectedProductOption}
          onChange={handleProductOptionChange}
          SelectProps={{
            displayEmpty: true,
          }}
        >
          {Object.keys(products).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="outlined-basic"
          label="Quantity"
          value={newQuantity}
          required
          variant="outlined"
          type="number"
          onChange={(e) => {
            setNewQuantity(e.target.value);
          }}
        />

        <Button variant="contained" color="primary" onClick={addInvLigne}>
          Add Invoice Ligne
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={invLigne}
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

export default InvLigne;
