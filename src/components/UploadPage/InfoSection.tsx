import { Box } from '@mui/material';
import { Section } from '../Section';
import { InfoCard } from './InfoCard';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';

const InfoItems = [
    {
        icon: DescriptionOutlinedIcon,
        title: "What is a SimplyGo PDF?",
        text: "Your monthly transit history statement, downloadable from the SimplyGo mobile app"
    },
    {
        icon: ShieldOutlinedIcon,
        title: "Privacy",
        text: "Your data is stored securely and used only to generate your concession pass recommendation"
    },
    {
        icon: PersonOutlineOutlinedIcon,
        title: "Personalized",
        text: "Recommendations based on your transit history, no manual calculations needed!"
    },
    {
        icon: FlashOnOutlinedIcon,
        title: "Fast",
        text: "Get your concession pass recommendation in seconds"
    }
]

export const InfoSection = () => {
    return (
        <Section>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2
            }}>
                {InfoItems.map((item, index) => (
                    <InfoCard key={index} icon={item.icon} title={item.title} text={item.text} />
                ))}
            </Box>
        </Section>
    )
}