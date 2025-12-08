import { Section } from '../Section';
import type { Journey } from '../../types';
import { JourneyCards } from './JourneyCards';

interface TripReviewSectionProps {
    journeys: Journey[];
}

export const TripReviewSection = ({ journeys }: TripReviewSectionProps) => {
    return (
        <Section>
            <JourneyCards journeys={journeys} />
        </Section>
    )
};