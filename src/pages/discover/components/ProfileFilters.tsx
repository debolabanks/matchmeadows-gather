
import MatchPreferences from "@/components/MatchPreferences";
import { MatchCriteria } from "@/utils/matchingAlgorithm";

interface ProfileFiltersProps {
  preferences: MatchCriteria;
  onChange: (newPreferences: Partial<MatchCriteria>) => void;
}

const ProfileFilters = ({ preferences, onChange }: ProfileFiltersProps) => {
  return <MatchPreferences preferences={preferences} onChange={onChange} />;
};

export default ProfileFilters;
