import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Title from './Title';
import { Box, Button, Tab } from '@mui/material';
import PersonModal from './person_components/PersonModal';
import UnitModal from './person_components/UnitModal';
import RankModal from './person_components/RankModal';
import PersonTable from './person_components/PersonTable';
import UnitTable from './person_components/UnitTable';
import RankTable from './person_components/RankTable';

// Add this import statement for the Unit and Rank types
import { Person, Unit, Rank } from './person_components/types'; // Update the path if needed
import axios from 'axios';
import { TabContext, TabList, TabPanel } from '@mui/lab';

export default function PersonDashboard() {
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [personData, setPersonData] = useState<any>([]);
  const [personCount, setPersonCount] = useState<any>();
  const [unitCount, setUnitCount] = useState<any>();
  const [rankCount, setRankCount] = useState<any>();
  const [unit, setUnit] = useState<any>([]);
  const [rank, setRank] = useState<any>([]);
  const [value, setValue] = React.useState('1');
  const [subUnitData, setSubUnitData] = useState<any>();
  const [stationData, setStationData] = useState<any>();
  const [subStationData, setSubStationData] = useState<any>();
  const [token, setToken] = useState<any>();

  const fetchPersonData = (page: any) => {
    axios.get(`/api/person/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setPersonData(res.data.results)
    })
  }

  const fetchUnitData = (page: any) => {
    axios.get(`/api/unit/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setUnit(res.data.results)
    })
  }

  const fetchRankData = (page: any) => {
    axios.get(`/api/rank/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      setRank(res.data.results)
    })
  }

  const handleCloseAddPersonModal = () => {
    setAddPersonModalOpen(false);
  };

  const handleCloseUnitModal = () => {
    setUnitModalOpen(false);
  };

  const handleCloseRankModal = () => {
    setRankModalOpen(false);
  };

  const handleAddPerson = (person: any) => {
    axios.post('/api/person/', {
      acccountNumber: person.accountNumber,
      full_name: person.full_name,
      rank: person.rank,
      unit: person.unit,
      email: person.email
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      fetchPersonData(1)
    })
  };

  const handleAddUnit = (data: any) => {
    axios.post('/api/unit/', {
      unit_code: data.unit_code,
      description: data.description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      fetchUnitData(1)
    })
  };

  const handleAddRank = (data: any) => {
    axios.post('/api/rank/', {
      rank_code: data.rank_code,
      description: data.description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res: any) => {
      fetchRankData(1)
    })
  };

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setToken(access_token)
    const getData = async () => {
      axios.get(`/api/person/`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).then((res: any) => {
        setPersonData(res.data.results)
        setPersonCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }
    const getUnit = async () => {
      axios.get(`/api/unit/`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).then((res: any) => {
        setUnit(res.data.results)
        setUnitCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }
    const getRank = async () => {
      axios.get(`/api/rank/`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).then((res: any) => {
        setRank(res.data.results)
        setRankCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }

    getData();
    getUnit();
    getRank();
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Person" value="1" />
              <Tab label="Rank" value="2" />
              <Tab label="Unit" value="3" />
              {/* <Tab label="Sub Unit" value="4" />
              <Tab label="Station" value="5" />
              <Tab label="Sub Station" value="6" /> */}
            </TabList>
          </Box>
          <TabPanel value="1">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setAddPersonModalOpen(true)}>
                  Add Person
                </Button>
              </Box>
              <Title>Person</Title>
              <PersonTable rows={personData} count={personCount}
                pagination={
                  (page: any) => {
                    fetchPersonData(page)
                  }}
              />
            </React.Fragment>
          </TabPanel>
          <TabPanel value="2">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setRankModalOpen(true)}>
                  Add Rank
                </Button>
              </Box>
              <Title>Rank</Title>
              <RankTable rows={rank} count={rankCount}
                pagination={
                  (page: any) => {
                    fetchRankData(page)
                  }}
              />
            </React.Fragment>
            <RankModal open={rankModalOpen} onClose={handleCloseRankModal} onAddRank={handleAddRank} />
          </TabPanel>
          <TabPanel value="3">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setUnitModalOpen(true)}>
                  Add Unit
                </Button>
              </Box>
              <Title>Unit</Title>
              <UnitTable rows={unit} count={unitCount}
                pagination={
                  (page: any) => {
                    fetchUnitData(page)
                  }}
              />
            </React.Fragment>
            <UnitModal open={unitModalOpen} onClose={handleCloseUnitModal} onAddUnit={handleAddUnit} />
          </TabPanel>
        </TabContext>
      </Box>
      <PersonModal
        open={addPersonModalOpen}
        onClose={handleCloseAddPersonModal}
        onAddPerson={handleAddPerson}
        token={token}
      />
    </Grid>
  );
}
