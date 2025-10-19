import { Box } from '@mui/material';
import ConcessionAnalyzer from "../components/ConcessionAnalyser";

function Home() {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#ffffff' }}>
            <ConcessionAnalyzer />
        </Box>
    )
}

export default Home;