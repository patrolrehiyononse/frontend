import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

type PersonModalProps = {
  open: boolean;
  onClose: () => void;
  onAddPerson: (person: Person) => void;
  token: any;
};

type Person = {
  accountNumber: any
  full_name: any;
  rank: any;
  unit: any;
  email: any;
};

const PersonModal: React.FC<PersonModalProps> = ({ open, onClose, onAddPerson, token }) => {
  const [units, setUnits] = React.useState<any>([]);
  const [ranks, setRanks] = React.useState<any>([]);
  const [rank, setRank] = React.useState<string>();
  const [unit, setUnit] = React.useState<string>();
  const [fullName, setFullName] = React.useState<string>();
  const [accountNumber, setAccountNumber] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [role, setRole] = React.useState<string>();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    axios.get("/api/unit/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any) => {
      setUnits(res.data.results)
    })
  }, [])

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    axios.get("/api/rank/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any) => {
      setRanks(res.data.results)
    })
  }, [])

  const handleAddPerson = () => {
    onAddPerson({
      accountNumber: accountNumber,
      full_name: fullName,
      rank: rank,
      unit: unit,
      email: email,
    })
    setUnit("")
    setRank("")
    setAccountNumber("")
    setEmail("")
    setFullName("")
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 400,
        }}
      >
        <TextField
          label="Account Number"
          fullWidth
          margin="normal"
          name="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <FormControl fullWidth sx={{ marginBottom: "10px" }}>
          <InputLabel id="demo-simple-select-label">Unit</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={unit}
            label="Age"
            onChange={(e) => setUnit(e.target.value)}
          >
            {units.map((items: any) => (
              <MenuItem value={items.unit_code} key={items.id}>{items.unit_code}</MenuItem>
            )
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Rank</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={rank}
            label="Age"
            onChange={(e) => setRank(e.target.value)}
          >
            {ranks.map((items: any) => (
              <MenuItem value={items.rank_code} key={items.id}>{items.rank_code}</MenuItem>
            )
            )}
          </Select>
        </FormControl>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value={"user"}>User</MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
          </Select>
        </FormControl> */}
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button variant="contained" onClick={handleAddPerson}>
            Add
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ ml: 1 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PersonModal;
