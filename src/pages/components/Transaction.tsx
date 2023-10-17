import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import axios from 'axios';
import moment from 'moment';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Pagination, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocateModal from './transaction_components/locateModal';
import ExploreIcon from '@mui/icons-material/Explore';
import app from '../../http_settings';

export default function Transaction() {
  const [data, setData] = useState<any>([]);
  const [count, setCount] = useState<number>();
  const [searchInput, setSearchInput] = useState('');
  const [object, setObject] = useState('');
  const [additionalFilterOption, setAdditionalFilterOption] = useState('');
  const [openLocate, setOpenLocate] = useState<boolean>(false);
  const [latLng, setLatLng] = useState<any>([]);
  const [token, setToken] = useState<any>('');



  const fetchData = async (page: number, object: string, value: string) => {
    app.get(`/api/transaction/?object=${object}&value=${value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setData(res.data.results)
      setCount(Math.ceil(res.data.count / res.data.results.length))
    })
  }

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setToken(access_token)
    const getData = async () => {
      await app.get("/api/transaction/", {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).then((res) => {
        setCount(Math.ceil(res.data.count / res.data.results.length))
        setData(res.data.results)
      })
    }

    getData();
  }, [])

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  // const searchBar = () => {
  //   return data.filter((row: any) => {
  //     return (
  //       row.person.full_name.toLowerCase().includes(searchInput.toLowerCase()) &&
  //       (!object || row.person.rank?.rank_code === filterOption) &&
  //       (!additionalFilterOption || row.person.additionalProperty === additionalFilterOption)
  //     );
  //   });
  // }

  const handleOnCloseLocate = () => {
    setOpenLocate(false)
  }

  // const filteredData = searchBar();

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      console.log("testing")
      console.log(searchInput)
      fetchData(1, object, searchInput)
    }
  }

  const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
    // setPage(value);
    app.get(`/api/transaction/?page=${value}&object=${object}&value=${searchInput}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then((res) => {
      setData(res.data.results)
    })
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" size="small" style={{ marginRight: '8px' }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={object}
              onChange={(e) => setObject(e.target.value)}
              label="Filter"
              style={{ minWidth: '120px' }}
            >
              {/* Replace 'rank_code' with the actual property name for filtering */}
              <MenuItem value="person">Person</MenuItem>
              <MenuItem value="unit">Unit</MenuItem>
              <MenuItem value="station">Station</MenuItem>
              {/* Add more filter options as needed */}
            </Select>
          </FormControl>
          <TextField
            label="Search"
            value={searchInput}
            onChange={handleSearchInputChange}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
            style={{ marginRight: '8px' }}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <Title>Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date & Time</TableCell>
            <TableCell>Rank / Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Station</TableCell>
            <TableCell>Coordinates</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{moment(row.datetime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                <TableCell>{row.person.full_name} / {row.person.rank?.rank_code}</TableCell>
                <TableCell>{row.person.unit?.unit_code}</TableCell>
                <TableCell>{row.person.station?.station_name}</TableCell>
                <TableCell>{row.lat} / {row.lng}</TableCell>
                <TableCell align='right'>
                  <Button variant="text" onClick={(e) => {
                    setOpenLocate(true)
                    setLatLng([row.lng, row.lat])
                  }}>
                    <ExploreIcon />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
      <LocateModal open={openLocate} onClose={handleOnCloseLocate} location={latLng} />
      {/* <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link> */}
    </React.Fragment>
  );
}
