import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Fragment } from "react";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const invoicesCollectionRef = collection(db, "invoices");
  const clientsCollectionRef = collection(db, "clients");

  const [newKey, setNewKey] = useState("");
  const [newCost, setNewCost] = useState();
  const [newNumCli, setNewNumCli] = useState();

  useEffect(() => {
    const getInvoices = async () => {
      const data = await getDocs(invoicesCollectionRef);
      setInvoices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getInvoices();
  }, []);

  useEffect(() => {
    const getClients = async () => {
      const data = await getDocs(clientsCollectionRef);
      setClients(data.docs.map((doc) => doc.data().num));
    };
    getClients();
  }, []);

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setNewNumCli(event.target.value);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
      description: "Invoice ID",
      sortable: false,
      flex: 1,
      editable: true,
    },
    {
      field: "key",
      headerName: "Key",
      width: 120,
      description: "Invoice Key",
      flex: 1,
      editable: true,
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 120,
      description: "Invoice Cost",
      flex: 1,
      editable: true,
    },
    {
      field: "numCli",
      headerName: "Client Number",
      width: 120,
      description: "Client Number",
      flex: 1,
      editable: true,
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

    const docReff = doc(db, "invoices", row.id);
    updateDoc(docReff, {
      key: row.key,
      cost: row.cost,
      numCli: row.numCli,
    }).then(() => {});
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (confirmed) {
      const docRef = doc(db, "invoices", id);
      deleteDoc(docRef)
        .then(() => {
          setInvoices((prevInvoices) =>
            prevInvoices.filter((client) => client.id !== id)
          );
          window.alert("Invoice Deleted");
        })
        .catch((error) => {
          console.error("Error removing invoice: ", error);
        });
    }
  };

  const addInvoice = async () => {
    await addDoc(invoicesCollectionRef, {
      key: newKey,
      cost: newCost,
      numCli: newNumCli,
    });

    const data = await getDocs(invoicesCollectionRef);
    setInvoices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    setNewKey("");
    setNewCost("");
    setNewNumCli("");
    setSelectedOption("");
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
          label="Key"
          value={newKey}
          required
          variant="outlined"
          onChange={(e) => {
            setNewKey(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Cost"
          value={newCost}
          required
          variant="outlined"
          type="number"
          onChange={(e) => {
            setNewCost(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Client Number"
          required
          helperText="Please select Client Number"
          variant="outlined"
          select
          value={selectedOption}
          onChange={handleOptionChange}
          SelectProps={{
            displayEmpty: true,
          }}
        >
          {clients.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" onClick={addInvoice}>
          Add Invoice
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          pagination
          editMode="cell"
          disableSelectionOnClick
        ></DataGrid>
      </div>
    </Fragment>
  );
}

export default Invoice;
