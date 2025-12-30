import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface ProfileData {
  age: number;
  gender: string;
  income: number;
  tenure: number;
  serviceType: string;
  monthlySpend: number;
  autoPay: boolean;
  supportCalls: number;
  lastInteraction: string;
}

interface ProfileDetailsProps {
  customerName: string;
  profileId: string;
  data: ProfileData;
  onChange: (data: ProfileData) => void;
}

const ProfileDetails = ({ customerName, profileId, data, onChange }: ProfileDetailsProps) => {
  const updateField = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          Profile Details <span className="text-muted-foreground font-normal">(modifiable)</span>
        </h3>
        <p className="text-sm text-muted-foreground">{customerName} • {profileId}</p>
      </div>

      <Accordion type="multiple" defaultValue={["demographics", "usage", "financial", "interactions"]} className="space-y-4">
        {/* Demographics */}
        <AccordionItem value="demographics" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="text-foreground font-semibold hover:no-underline">
            Demographics
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm text-foreground">Age</Label>
                <span className="text-sm font-medium text-primary">{data.age} years</span>
              </div>
              <Slider
                value={[data.age]}
                onValueChange={([val]) => updateField("age", val)}
                min={18}
                max={80}
                step={1}
              />
            </div>

            <div>
              <Label className="text-sm text-foreground mt-4 mb-2 block">Gender</Label>
              <Select value={data.gender} onValueChange={(val) => updateField("gender", val)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between mt-2 my-2">
                <Label className="text-sm text-foreground">Annual Income</Label>
                <span className="text-sm font-medium text-primary">${data.income.toLocaleString()}</span>
              </div>
              <Slider
                value={[data.income]}
                onValueChange={([val]) => updateField("income", val)}
                min={20000}
                max={200000}
                step={5000}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Usage Patterns */}
        <AccordionItem value="usage" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="text-foreground font-semibold hover:no-underline">
            Usage Patterns
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm text-foreground">Tenure (months)</Label>
                <span className="text-sm font-medium text-primary">{data.tenure} months</span>
              </div>
              <Slider
                value={[data.tenure]}
                onValueChange={([val]) => updateField("tenure", val)}
                min={1}
                max={120}
                step={1}
              />
            </div>

            <div>
              <Label className="text-sm text-foreground mt-4 mb-2 block">Service Type</Label>
              <Select value={data.serviceType} onValueChange={(val) => updateField("serviceType", val)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Financial Metrics */}
        <AccordionItem value="financial" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="text-foreground font-semibold hover:no-underline">
            Financial Metrics
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm text-foreground">Monthly Spend</Label>
                <span className="text-sm font-medium text-primary">${data.monthlySpend.toLocaleString()}</span>
              </div>
              <Slider
                value={[data.monthlySpend]}
                onValueChange={([val]) => updateField("monthlySpend", val)}
                min={50}
                max={5000}
                step={50}
              />
            </div>

            <div className="flex items-center justify-between mt-4 mb-2">
              <Label className="text-sm text-foreground">Auto-Pay Enabled</Label>
              <Switch
                checked={data.autoPay}
                onCheckedChange={(val) => updateField("autoPay", val)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Customer Interactions */}
        <AccordionItem value="interactions" className="border border-border rounded-lg px-4">
          <AccordionTrigger className="text-foreground font-semibold hover:no-underline">
            Customer Interactions
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm text-foreground">Support Calls (last 3 months)</Label>
                <span className="text-sm font-medium text-primary">{data.supportCalls} calls</span>
              </div>
              <Slider
                value={[data.supportCalls]}
                onValueChange={([val]) => updateField("supportCalls", val)}
                min={0}
                max={20}
                step={1}
              />
            </div>

            <div>
              <Label className="text-sm text-foreground mt-4 mb-2 block">Last Interaction</Label>
              <Select value={data.lastInteraction} onValueChange={(val) => updateField("lastInteraction", val)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                  <SelectItem value="Within a week">Within a week</SelectItem>
                  <SelectItem value="Within a month">Within a month</SelectItem>
                  <SelectItem value="Over 3 months">Over 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProfileDetails;
