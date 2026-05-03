import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SA_LOCATIONS } from '@/lib/serviceData';

export const LocationSelect = ({ value, onChange, placeholder = 'Select location' }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger className="border-0 focus:ring-0 bg-transparent shadow-none h-10 px-0">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="max-h-72">
      {SA_LOCATIONS.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
    </SelectContent>
  </Select>
);
