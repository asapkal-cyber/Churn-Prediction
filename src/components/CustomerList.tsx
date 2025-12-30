import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Customer {
  id: string;
  name: string;
  profileId: string;
}

interface CustomerListProps {
  customers: Customer[];
  selectedId: string | null;
  onSelect: (customer: Customer) => void;
}

const CustomerList = ({ customers, selectedId, onSelect }: CustomerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.profileId.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No customers found</p>
          ) : (
            filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => onSelect(customer)}
                className={cn(
                  "w-full text-left p-4 rounded-lg mb-2 transition-all duration-200 border-2",
                  selectedId === customer.id
                    ? "border-foreground bg-secondary/50"
                    : "border-transparent hover:bg-muted/50"
                )}
              >
                <p className="font-medium text-foreground">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.profileId}</p>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CustomerList;
