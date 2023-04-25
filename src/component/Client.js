import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";

import CancelIcon from "@mui/icons-material/Cancel";

import { Check as CheckIcon, Edit as EditIcon } from "@mui/icons-material";

import { Fragment } from "react";

function Client() {
  const [clients, setClients] = useState([]);

  const [editStates, setEditStates] = useState({});
  // const [isEditable, setIsEditable] = useState(false);
  const [editLignes, setEditLignes] = useState(false);
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

  // useEffect(() => {
  //   const getClients = async () => {
  //     const data = await getDocs(clientsCollectionRef);
  //     setClients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  //   getClients();
  // }, [editLignes]); // ! should be an array of dependencies

  // const theRef = useGridApiRef();

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

      renderCell: (params) => {
        // const isEdit = theRef.current.getRowMode(params.id) === "edit";
        return editStates[params.row.id] === true ? (
          <>
            <IconButton
              aria-label={"confirm"}
              onClick={() => {
                handleConfirmEdit(params.row);
              }}
              sx={{ cursor: "pointer" }}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              aria-label={"close"}
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
        );
      },
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

  // const rows = clients.map((client) => ({
  //   ...client,
  //   id: client.id.toString(),
  // }));

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

  const handleOpenEdit = (row) => {
    setEditStates((prev) => ({ ...prev, [row.id]: true }));
  };
  const handleCloseEdit = (row) => {
    setEditStates((prev) => ({ ...prev, [row.id]: false }));
  };

  const handleConfirmEdit = (row) => {
    setEditStates((prev) => ({ ...prev, [row.id]: false }));
    console.log(row);

    const docReff = doc(db, "clients", row.id);
    updateDoc(docReff, {
      num: row.num,
      firstName: row.firstName,
      lastName: row.lastName,
      age: row.age,
      gender: row.gender,
    }).then(() => {
      console.log("row updated");
    });
    setEditStates((prev) => ({ ...prev, [row.id]: false }));
    setEditLignes(true);
    console.log(editStates);
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
          rows={clients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          pagination
          editMode="cell"
          disableSelectionOnClick
        />
      </div>
    </Fragment>
  );
}

export default Client;
