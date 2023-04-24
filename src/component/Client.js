import { useState, useEffect, useRef, useCallback } from "react";
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
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import CancelIcon from "@mui/icons-material/Cancel";

import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";

import { Fragment } from "react";

function Client() {
  const [clients, setClients] = useState([]);

  const [editStates, setEditStates] = useState({});
  // const [isEditable, setIsEditable] = useState(false);
  const [editLignes, setEditLignes] = useState(false);
  const [editRowsModel, setEditRowsModel] = useState({});
  const clientsCollectionRef = collection(db, "clients");

  const [newNum, setNewNum] = useState();
  const [newFN, setNewFN] = useState("");
  const [newLN, setNewLN] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("");

  useEffect(() => {
    const getClients = async () => {
      const data = await getDocs(clientsCollectionRef);
      setClients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getClients();
  }, []);

  const gender = [
    { value: "male", label: "♂" },
    {
      value: "female",
      label: "♀",
    },
  ];

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
      sortable: false,
      description: "ID",
      flex: 1,
    },
    {
      field: "num",
      headerName: "Client Number",
      type: Number,
      width: 120,
      editable: true,
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 120,
      editable: true,
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 100,
      editable: true,
      flex: 1,
    },

    {
      field: "age",
      headerName: "Age",
      type: "number",
      description: "Age",
      width: 100,
      editable: true,
      flex: 1,
    },
    {
      field: "gender",
      headerName: "Gender",
      description: "Gender",
      width: 120,
      editable: true,
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 200,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      sortable: false,
      flex: 1,
      disableClickEventBubbling: true,

      renderCell: (params) =>
        editStates[params.row.id] === true ? (
          <>
            <IconButton
              aria-label={"edit"}
              onClick={() => handleConfirmEdit(params.row)}
              sx={{ cursor: "pointer" }}
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
            onClick={(e) => {
              handleOpenEdit(e, params.id);
              // handleEditCell();
            }}
          >
            <EditIcon />
          </IconButton>
        ),
    },

    // handleDeleteRows
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (confirmed) {
      const docRef = doc(db, "clients", id);
      deleteDoc(docRef)
        .then(() => {
          setClients((prevClients) =>
            prevClients.filter((client) => client.id !== id)
          );
          window.alert("Client Deleted");
        })
        .catch((error) => {
          console.error("Error removing client: ", error);
        });
    }
  };

  let rows = clients.map((client) => ({
    ...client,
    id: client.id.toString(),
  }));

  const addClient = async () => {
    await addDoc(clientsCollectionRef, {
      num: newNum,
      firstName: newFN,
      lastName: newLN,
      age: newAge,
      gender: newGender,
    });

    const data = await getDocs(clientsCollectionRef);
    setClients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    setNewNum("");
    setNewFN("");
    setNewLN("");
    setNewAge("");
    setNewGender("");
  };

  const handleOpenEdit = useCallback((e, id) => {
    setEditStates((prev) => ({ ...prev, [id]: true }));
    e.stopPropagation();
    setEditRowsModel((prevEditRowsModel) => ({
      ...prevEditRowsModel,
      [id]: { ...prevEditRowsModel[id], isEditing: true },
    }));
  }, []);

  const handleEditRowModelChange = useCallback((newModel) => {
    setEditRowsModel(newModel);
  }, []);

  const handleCloseEdit = (row) => {
    setEditStates((prev) => ({ ...prev, [row.id]: false }));
  };

  const handleConfirmEdit = async (row) => {
    setEditStates((prev) => ({ ...prev, [row.id]: false }));

    const docReff = doc(db, "clients", row.id);
    await updateDoc(docReff, {
      num: row.num,
      firstName: row.firstName,
      lastName: row.lastName,
      age: row.age,
      gender: row.gender,
    })
      .then(() => {
        console.log(row);
        // Update the rows array with the new data
        // Create a new rows array with the updated row data
        const newRows = rows.map((r) => {
          if (r.id === row.id) {
            return {
              ...r,
              num: row.num,
              firstName: row.firstName,
              lastName: row.lastName,
              age: row.age,
              gender: row.gender,
            };
          }
          return r;
        });

        // Replace the existing rows array with the new one
        rows.splice(0, rows.length, ...newRows);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <Box
        component="form"
        sx={{
          "& > :not(style)": {
            m: 1,
            width: "24ch",
            marginTop: "20px",
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Num"
          value={newNum}
          type="number"
          required
          variant="outlined"
          onChange={(e) => {
            setNewNum(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="First Name"
          value={newFN}
          required
          variant="outlined"
          onChange={(e) => {
            setNewFN(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Last Name"
          value={newLN}
          required
          variant="outlined"
          onChange={(e) => {
            setNewLN(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Age"
          value={newAge}
          required
          type="number"
          variant="outlined"
          onChange={(e) => {
            setNewAge(e.target.value);
          }}
        />
        <TextField
          id="outlined-select-currency"
          select
          label="Select"
          required
          helperText="Please select your Gender"
          onChange={(e) => {
            setNewGender(e.target.value);
          }}
        >
          {gender.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={addClient}>
          Add Client
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          pagination
          editMode="row"
          autoHeight
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </Fragment>
  );
}

export default Client;
