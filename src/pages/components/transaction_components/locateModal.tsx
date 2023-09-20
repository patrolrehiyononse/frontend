import React from 'react'
import { Box, DialogContent, DialogContentText, Modal, Tab } from '@mui/material';
import { LocatePerson } from './locatePerson';
import Dialog from '@mui/material/Dialog';
import { TabContext, TabList, TabPanel } from '@mui/lab';

function LocateModal(props: any) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogContent>
                {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText> */}
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Item One" value="1" />
                            <Tab label="Item Two" value="2" />
                            <Tab label="Item Three" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1"><LocatePerson location={props.location} /></TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                </TabContext>
                {/* <LocatePerson location={props.location}/> */}
            </DialogContent>
        </Dialog>
    )
}

export default LocateModal;