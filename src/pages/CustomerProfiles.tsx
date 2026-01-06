import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import CustomerList, { Customer } from "@/components/CustomerList";
import ChurnGauge from "@/components/ChurnGauge";
import ProfileDetails, { ProfileData } from "@/components/ProfileDetails";
import { useToast } from "@/hooks/use-toast";

// Get API base URL based on domain
const getApiBaseUrl = (domain: string): string => {
  // Allow override via environment variables
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // Use domain-specific API paths that proxy to correct backend ports
  switch (domain) {
    case "credit-card":
      return "/api/credit-card";
    case "isp":
      return "/api/isp";
    case "insurance":
      return "/api/insurance";
    default:
      return "/api/insurance"; // Default to insurance
  }
};

const getDefaultProfileData = (): ProfileData => ({
  age: 42,
  gender: "Male",
  income: 75000,
  tenure: 36,
  serviceType: "Premium",
  monthlySpend: 1250,
  autoPay: true,
  supportCalls: 3,
  lastInteraction: "Within a week",
});

const CustomerProfiles = () => {
  const [searchParams] = useSearchParams();
  const domain = searchParams.get("domain") || "insurance";
  const { toast } = useToast();

  // Get API base URL based on current domain
  const API_BASE_URL = useMemo(() => getApiBaseUrl(domain), [domain]);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [profileData, setProfileData] = useState<ProfileData>(
    getDefaultProfileData()
  );
  const [churnRisk, setChurnRisk] = useState(38);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    Customer_Age: "",
    Gender: "",
    Dependent_count: "",
    Education_Level: "",
    Marital_Status: "",
    Income_Category: "",
    Card_Category: "",
    Months_on_book: "",
    Total_Relationship_Count: "",
    Months_Inactive_12_mon: "",
    Contacts_Count_12_mon: "",
    Credit_Limit: "",
    Total_Revolving_Bal: "",
    Avg_Open_To_Buy: "",
    Total_Amt_Chng_Q4_Q1: "",
    Total_Trans_Amt: "",
    Total_Trans_Ct: "",
    Total_Ct_Chng_Q4_Q1: "",
    Avg_Utilization_Ratio: "",
  });

  const domainLabel = useMemo(() => {
    const labels: Record<string, string> = {
      insurance: "Insurance",
      "credit-card": "Credit Card",
      isp: "ISP",
      // equity: "Equity Trading",
    };
    return labels[domain] || "Insurance";
  }, [domain]);

  const generateClientId = () => {
    return Math.floor(100000000 + Math.random() * 900000000);
  };

  // Fetch customers from database
  const fetchCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/customers/ids`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (fetchError) {
        if (
          fetchError instanceof TypeError &&
          fetchError.message.includes("fetch")
        ) {
          console.error("Cannot connect to server:", fetchError);
          const portInfo =
            domain === "credit-card"
              ? "8000"
              : domain === "isp"
              ? "8090"
              : "8081";
          toast({
            title: "Connection Error",
            description: `Cannot connect to ${domainLabel} backend. Please make sure the backend server is running on port ${portInfo}.`,
            variant: "destructive",
          });
          return;
        }
        throw fetchError;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error(
          "Failed to fetch customers:",
          response.status,
          text.substring(0, 200)
        );
        const portInfo =
          domain === "credit-card"
            ? "8000"
            : domain === "isp"
            ? "8090"
            : "8081";
        toast({
          title: "Failed to Load Customers",
          description: `Server returned ${response.status}. Check if ${domainLabel} backend is running on port ${portInfo}.`,
          variant: "destructive",
        });
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "Expected JSON but got:",
          contentType,
          text.substring(0, 200)
        );
        const portInfo =
          domain === "credit-card"
            ? "8000"
            : domain === "isp"
            ? "8090"
            : "8070";
        toast({
          title: "Invalid Response",
          description: `Backend returned HTML instead of JSON. Check if ${domainLabel} FastAPI is running on port ${portInfo}.`,
          variant: "destructive",
        });
        return;
      }

      const customerIds: number[] = await response.json();
      
      console.log("Fetched customer IDs:", customerIds, "Domain:", domain);

      // Convert IDs to Customer objects
      const customersList: Customer[] = customerIds.map((id) => ({
        id: String(id),
        name: `Client ${id}`,
        profileId: String(id),
      }));

      console.log("Mapped customers list:", customersList);
      
      // Only update if we got valid data
      if (Array.isArray(customerIds) && customerIds.length > 0) {
        setCustomers(customersList);
      } else if (Array.isArray(customerIds) && customerIds.length === 0) {
        // Empty array is valid - no customers in database
        setCustomers([]);
        console.log("No customers found in database");
      } else {
        console.error("Invalid response format:", customerIds);
        toast({
          title: "Invalid Response",
          description: "Server returned invalid customer data format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      // Don't clear existing customers on error
      toast({
        title: "Error Loading Customers",
        description: "Failed to load customers from the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCustomers(false);
    }
  }, [toast, API_BASE_URL, domain, domainLabel]);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedCustomer) {
        setProfileData(getDefaultProfileData());
        setChurnRisk(38);
        return;
      }

      try {
        const clientnum = Number(selectedCustomer.id);
        let response;
        try {
          response = await fetch(`${API_BASE_URL}/customers/${clientnum}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (fetchError) {
          if (
            fetchError instanceof TypeError &&
            fetchError.message.includes("fetch")
          ) {
            console.error("Cannot connect to server:", fetchError);
            return;
          }
          throw fetchError;
        }

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          console.error(
            "Failed to fetch profile:",
            response.status,
            text.substring(0, 200)
          );
          return;
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error(
            "Expected JSON but got:",
            contentType,
            text.substring(0, 200)
          );
          return;
        }

        const json = await response.json();
        
        // Handle different response structures for different domains
        let data: Record<string, unknown>;
        if (domain === "isp") {
          // ISP: {id: number, features: {...}}
          data = json.features as Record<string, unknown> || {};
        } else if (domain === "insurance") {
          // Insurance: {ChassisNo: number, data: {...}}
          data = json.data as Record<string, unknown> || {};
        } else {
          // Credit Card: {CLIENTNUM: number, data: {...}}
          data = json.data as Record<string, unknown> || {};
        }

        // Map fields based on domain
        let age = 42;
        let gender = getDefaultProfileData().gender;
        let tenure = 36;
        let monthlySpend = 1250;
        let supportCalls = 3;

        if (domain === "isp") {
          // ISP fields don't map directly to UI, use defaults or derived values
          // subscription_age might be used as tenure (convert years.months to months)
          const subscriptionAge = typeof data["subscription_age"] === "number" 
            ? data["subscription_age"] as number 
            : 0;
          tenure = Math.round(subscriptionAge * 12); // Convert years to months
          
          // download_avg + upload_avg might represent monthly usage
          const downloadAvg = typeof data["download_avg"] === "number" 
            ? data["download_avg"] as number 
            : 0;
          const uploadAvg = typeof data["upload_avg"] === "number" 
            ? data["upload_avg"] as number 
            : 0;
          monthlySpend = downloadAvg + uploadAvg;
          
          // Use defaults for age and gender (not in ISP data)
          age = 42;
          gender = getDefaultProfileData().gender;
          supportCalls = 0; // Not available in ISP data
        } else if (domain === "insurance") {
          // Insurance: Use defaults or map available fields
          // CurrentPremium could map to monthlySpend
          const currentPremium = typeof data["CurrentPremium"] === "number"
            ? data["CurrentPremium"] as number
            : 1250;
          monthlySpend = currentPremium;
          
          // Use defaults for other fields (not in Insurance data)
          age = 42;
          gender = getDefaultProfileData().gender;
          tenure = 36;
          supportCalls = 3;
        } else {
          // Credit Card: Map existing fields
          age =
            typeof data["Customer_Age"] === "number"
              ? (data["Customer_Age"] as number)
              : 42;
          const genderRaw = data["Gender"];
          gender =
            genderRaw === "F"
              ? "Female"
              : genderRaw === "M"
              ? "Male"
              : getDefaultProfileData().gender;
          tenure =
            typeof data["Months_on_book"] === "number"
              ? (data["Months_on_book"] as number)
              : 36;
          monthlySpend =
            typeof data["Total_Trans_Amt"] === "number"
              ? (data["Total_Trans_Amt"] as number)
              : 1250;
          supportCalls =
            typeof data["Contacts_Count_12_mon"] === "number"
              ? (data["Contacts_Count_12_mon"] as number)
              : 3;
        }

        setProfileData({
          age,
          gender,
          income: 75000, // UI-only
          tenure,
          serviceType: "Premium", // UI-only
          monthlySpend,
          autoPay: true, // UI-only
          supportCalls,
          lastInteraction: "Within a week", // UI-only
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [selectedCustomer, API_BASE_URL]);

  const profileDetailsRef = useRef<HTMLDivElement | null>(null);

  const handleRunPrediction = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Select a customer",
        description:
          "Choose a customer from the list before running prediction.",
      });
      return;
    }

    const customerId = Number(selectedCustomer.id);
    if (!Number.isFinite(customerId)) {
      toast({
        title: "Invalid customer",
        description: "Selected customer has an invalid ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPredicting(true);
      
      // Different endpoints for different domains
      let predictionEndpoint: string;
      if (domain === "isp") {
        predictionEndpoint = `${API_BASE_URL}/customers/${customerId}/predict-only`;
      } else {
        predictionEndpoint = `${API_BASE_URL}/customers/${customerId}/predict`;
      }

      const response = await fetch(predictionEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Prediction failed");
      }
      
      const json = await response.json();
      
      // Parse prediction based on domain
      let calculatedRisk: number = 0;
      if (domain === "isp") {
        // ISP: {prediction: {churn_probability_percent}}
        calculatedRisk = json?.prediction?.churn_probability_percent 
          ? Math.round(json.prediction.churn_probability_percent) 
          : 0;
      } else if (domain === "insurance") {
        // Insurance: {prediction: {probability: "85.28%"}}
        const probStr = json?.prediction?.probability;
        if (probStr && typeof probStr === "string") {
          const probNum = parseFloat(probStr.replace("%", ""));
          calculatedRisk = isNaN(probNum) ? 0 : Math.round(probNum);
        }
      } else {
        // Credit Card: {prediction: {probability_percent}}
        const riskRaw = json?.prediction?.probability_percent;
        calculatedRisk = typeof riskRaw === "number" ? Math.round(riskRaw) : 0;
      }
      
      setChurnRisk(calculatedRisk);
      toast({
        title: "Prediction Complete",
        description: `Churn risk calculated: ${calculatedRisk}%`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Prediction failed",
        description: "Unable to get prediction from the server.",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleReset = () => {
    setProfileData(getDefaultProfileData());
    setChurnRisk(38);
    toast({
      title: "Reset Complete",
      description: "Profile data has been reset to defaults.",
    });
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      {/* Custom Navbar for Profiles */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="Churn Prediction Logo"
                className="w-8 h-8"
              />
              <span className="text-lg font-semibold text-foreground">
                Churn Prediction
              </span>
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>←</span>
              <span>Back to Domain Selection</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
            Customer Profile
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              Domain:{" "}
              <span className="font-medium text-foreground">{domainLabel}</span>
            </p>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(true)}
              className="ml-auto"
            >
              New Customer
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer List */}
            <div className="lg:col-span-1 h-[600px]">
              <CustomerList
                customers={customers}
                selectedId={selectedCustomer?.id || null}
                onSelect={setSelectedCustomer}
              />
              {isLoadingCustomers && (
                <p className="text-xs text-muted-foreground px-4 pb-2 pt-1">
                  Loading customers from server...
                </p>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedCustomer && (
                <>
                  {/* Customer Header Card */}
                  <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-icon-blue/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-icon-blue">
                            {selectedCustomer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {selectedCustomer.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Profile ID: {selectedCustomer.profileId}
                          </p>
                          <div className="flex flex-row gap-2">
                            <button
                              type="button"
                              className="text-sm text-primary hover:underline"
                              onClick={() => {
                                profileDetailsRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }}
                            >
                              See Details
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-0 text-blue-800 hover:underline"
                            >
                              Update Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Prediction Date
                        </p>
                        <p className="font-semibold text-foreground">{today}</p>
                      </div>
                    </div>
                  </div>

                  {/* Churn Prediction Gauge */}
                  <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-foreground text-center mb-4">
                      Churn Prediction
                    </h3>
                    <ChurnGauge value={churnRisk} />
                  </div>

                  {/* Profile Details */}
                  <div ref={profileDetailsRef}>
                    <ProfileDetails
                      customerName={selectedCustomer.name}
                      profileId={selectedCustomer.profileId}
                      data={profileData}
                      onChange={setProfileData}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleRunPrediction}
                      size="lg"
                      className="flex-1"
                      disabled={isPredicting}
                    >
                      {isPredicting ? "Running..." : "Run Prediction"}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-xl border border-border shadow-lg w-full max-w-4xl max-h-[90vh] p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Create New Customer
              </h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => !isCreating && setIsCreateOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  value={newCustomer.Customer_Age}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Customer_Age: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Gender</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newCustomer.Gender}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, Gender: e.target.value })
                  }
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div>
                <Label>Education Level</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newCustomer.Education_Level}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Education_Level: e.target.value,
                    })
                  }
                >
                  <option value="">Select education</option>
                  <option value="Uneducated">Uneducated</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <Label>Marital Status</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newCustomer.Marital_Status}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Marital_Status: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <Label>Dependent Count</Label>
                <Input
                  type="number"
                  value={newCustomer.Dependent_count}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Dependent_count: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Income Category</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newCustomer.Income_Category}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Income_Category: e.target.value,
                    })
                  }
                >
                  <option value="">Select income</option>
                  <option value="Less than $40K">Less than $40K</option>
                  <option value="$40K - $60K">$40K - $60K</option>
                  <option value="$60K - $80K">$60K - $80K</option>
                  <option value="$80K - $120K">$80K - $120K</option>
                  <option value="$120K +">$120K +</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <Label>Card Category</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newCustomer.Card_Category}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Card_Category: e.target.value,
                    })
                  }
                >
                  <option value="">Select card category</option>
                  <option value="Blue">Blue</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>

              <div>
                <Label>Customer Tenure (Months)</Label>
                <Input
                  type="number"
                  value={newCustomer.Months_on_book}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Months_on_book: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Total Relationship Count</Label>
                <Input
                  type="number"
                  value={newCustomer.Total_Relationship_Count}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Total_Relationship_Count: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Months Inactive (Last 12 Months)</Label>
                <Input
                  type="number"
                  value={newCustomer.Months_Inactive_12_mon}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Months_Inactive_12_mon: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Support Calls (Last 12 Months)</Label>
                <Input
                  type="number"
                  value={newCustomer.Contacts_Count_12_mon}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Contacts_Count_12_mon: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Credit Limit</Label>
                <Input
                  type="number"
                  value={newCustomer.Credit_Limit}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Credit_Limit: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Total Revolving Balance</Label>
                <Input
                  type="number"
                  value={newCustomer.Total_Revolving_Bal}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Total_Revolving_Bal: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Avg Open To Buy</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newCustomer.Avg_Open_To_Buy}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Avg_Open_To_Buy: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Total Amount Change Q4 to Q1</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={newCustomer.Total_Amt_Chng_Q4_Q1}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Total_Amt_Chng_Q4_Q1: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Total Transaction Amount</Label>
                <Input
                  type="number"
                  value={newCustomer.Total_Trans_Amt}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Total_Trans_Amt: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Total Transaction Count</Label>
                <Input
                  type="number"
                  value={newCustomer.Total_Trans_Ct}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Total_Trans_Ct: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Total Count Change Q4 to Q1</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={newCustomer.Total_Ct_Chng_Q4_Q1}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Total_Ct_Chng_Q4_Q1: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Avg Utilization Ratio</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={newCustomer.Avg_Utilization_Ratio}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      Avg_Utilization_Ratio: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                disabled={isCreating}
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isCreating}
                onClick={async () => {
                  if (isCreating) return;

                  setIsCreating(true);
                  try {
                    const clientId = generateClientId();

                    // Build payload with all required fields, using defaults if not provided
                    // Note: CLIENTNUM is generated by backend, don't include it
                    const payload: Record<string, any> = {
                      // Always include all required fields with defaults
                      Customer_Age: newCustomer.Customer_Age
                        ? Number(newCustomer.Customer_Age)
                        : 18,
                      Gender: newCustomer.Gender || "M",
                      Dependent_count: newCustomer.Dependent_count
                        ? Number(newCustomer.Dependent_count)
                        : 0,
                      Education_Level:
                        newCustomer.Education_Level || "Uneducated",
                      Marital_Status: newCustomer.Marital_Status || "Single",
                      Income_Category:
                        newCustomer.Income_Category || "Less than $40K",
                      Card_Category: newCustomer.Card_Category || "Blue",
                      Credit_Limit: newCustomer.Credit_Limit
                        ? Number(newCustomer.Credit_Limit)
                        : 0,
                      Total_Revolving_Bal: newCustomer.Total_Revolving_Bal
                        ? Number(newCustomer.Total_Revolving_Bal)
                        : 0,
                      Avg_Open_To_Buy: newCustomer.Avg_Open_To_Buy
                        ? Number(newCustomer.Avg_Open_To_Buy)
                        : 0,
                      Avg_Utilization_Ratio: newCustomer.Avg_Utilization_Ratio
                        ? Number(newCustomer.Avg_Utilization_Ratio)
                        : 1,
                      Months_on_book: newCustomer.Months_on_book
                        ? Number(newCustomer.Months_on_book)
                        : 0,
                      Total_Relationship_Count:
                        newCustomer.Total_Relationship_Count
                          ? Number(newCustomer.Total_Relationship_Count)
                          : 0,
                      Months_Inactive_12_mon: newCustomer.Months_Inactive_12_mon
                        ? Number(newCustomer.Months_Inactive_12_mon)
                        : 0,
                      Contacts_Count_12_mon: newCustomer.Contacts_Count_12_mon
                        ? Number(newCustomer.Contacts_Count_12_mon)
                        : 0,
                      Total_Trans_Amt: newCustomer.Total_Trans_Amt
                        ? Number(newCustomer.Total_Trans_Amt)
                        : 0,
                      Total_Trans_Ct: newCustomer.Total_Trans_Ct
                        ? Number(newCustomer.Total_Trans_Ct)
                        : 0,
                      Total_Amt_Chng_Q4_Q1: newCustomer.Total_Amt_Chng_Q4_Q1
                        ? Number(newCustomer.Total_Amt_Chng_Q4_Q1)
                        : 0,
                      Total_Ct_Chng_Q4_Q1: newCustomer.Total_Ct_Chng_Q4_Q1
                        ? Number(newCustomer.Total_Ct_Chng_Q4_Q1)
                        : 0,
                    };

                    let response;
                    try {
                      response = await fetch(`${API_BASE_URL}/customers`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                      });
                    } catch (fetchError) {
                      // Handle network errors (connection refused, CORS, etc.)
                      if (
                        fetchError instanceof TypeError &&
                        fetchError.message.includes("fetch")
                      ) {
                        const portInfo =
                          domain === "credit-card"
                            ? "8000"
                            : domain === "isp"
                            ? "8090"
                            : "8070";
                        const errorMsg = API_BASE_URL.startsWith("/api")
                          ? `Cannot connect to ${domainLabel} backend. Make sure backend is running on port ${portInfo} and Vite dev server is restarted.`
                          : `Cannot connect to server at ${API_BASE_URL}. Please check if the ${domainLabel} backend is running on port ${portInfo}.`;
                        throw new Error(errorMsg);
                      }
                      throw fetchError;
                    }

                    // Read response as text first (so we can handle both JSON and text errors)
                    const responseText = await response.text();

                    let json;
                    try {
                      json = JSON.parse(responseText);
                    } catch (parseError) {
                      // If response is not JSON, use the text as error message
                      throw new Error(
                        `Invalid response from server (${response.status}): ${
                          responseText || "Unknown error"
                        }`
                      );
                    }

                    if (!response.ok) {
                      // If it's a 500 error, the customer might have been created anyway
                      // Check if the customer was created by trying to fetch it directly
                      if (response.status === 500) {
                        console.warn(
                          "Server error during customer creation, checking if customer was created...",
                          { status: response.status, json, responseText }
                        );

                        try {
                          const checkResponse = await fetch(
                            `${API_BASE_URL}/customers/${clientId}`,
                            {
                              method: "GET",
                              headers: { "Content-Type": "application/json" },
                            }
                          );

                          if (checkResponse.ok) {
                            // Customer was created but prediction failed
                            const newCustomerUI: Customer = {
                              id: String(clientId),
                              name: `Client ${clientId}`,
                              profileId: String(clientId),
                            };

                            // Add to customers list
                            setCustomers((prev) => {
                              const exists = prev.some(
                                (c) => c.id === String(clientId)
                              );
                              if (exists) return prev;
                              return [...prev, newCustomerUI];
                            });

                            setSelectedCustomer(newCustomerUI);
                            setChurnRisk(0); // Set default since prediction failed

                            toast({
                              title: "Customer Created",
                              description: `Customer ${clientId} was created successfully. Prediction failed - you can run prediction manually.`,
                              variant: "default",
                            });

                            // Reset form and close modal
                            setNewCustomer({
                              Customer_Age: "",
                              Gender: "",
                              Dependent_count: "",
                              Education_Level: "",
                              Marital_Status: "",
                              Income_Category: "",
                              Card_Category: "",
                              Months_on_book: "",
                              Total_Relationship_Count: "",
                              Months_Inactive_12_mon: "",
                              Contacts_Count_12_mon: "",
                              Credit_Limit: "",
                              Total_Revolving_Bal: "",
                              Avg_Open_To_Buy: "",
                              Total_Amt_Chng_Q4_Q1: "",
                              Total_Trans_Amt: "",
                              Total_Trans_Ct: "",
                              Total_Ct_Chng_Q4_Q1: "",
                              Avg_Utilization_Ratio: "",
                            });
                            setIsCreateOpen(false);

                            // Refresh customer list to ensure consistency
                            fetchCustomers().catch(() => {});

                            return; // Exit early, don't throw error
                          }
                        } catch (checkError) {
                          console.error(
                            "Error checking if customer exists:",
                            checkError
                          );
                          // Continue to throw original error if check fails
                        }
                      }

                      // FastAPI validation errors return detail as an array of error objects
                      let errorMessage: string;
                      if (Array.isArray(json?.detail)) {
                        // Format validation errors nicely
                        errorMessage = json.detail
                          .map((err: any) => {
                            if (typeof err === "string") return err;
                            const loc = err.loc ? err.loc.join(".") : "";
                            const msg =
                              err.msg || err.message || "Validation error";
                            return loc ? `${loc}: ${msg}` : msg;
                          })
                          .join(", ");
                      } else if (typeof json?.detail === "string") {
                        errorMessage = json.detail;
                      } else if (json?.message) {
                        errorMessage = json.message;
                      } else if (json?.error) {
                        errorMessage =
                          typeof json.error === "string"
                            ? json.error
                            : JSON.stringify(json.error);
                      } else {
                        errorMessage =
                          responseText ||
                          `Failed to create customer (${response.status})`;
                      }

                      console.error("Backend error response:", {
                        status: response.status,
                        json,
                        responseText,
                      });
                      throw new Error(errorMessage);
                    }

                    // Extract customer ID based on domain
                    let clientNum: number;
                    if (domain === "isp") {
                      clientNum = json.customer_id ?? clientId;
                    } else if (domain === "insurance") {
                      clientNum = json.ChassisNo ?? clientId;
                    } else {
                      // Credit Card
                      clientNum = json.CLIENTNUM ?? clientId;
                    }
                    
                    const newCustomerUI: Customer = {
                      id: String(clientNum),
                      name: `Client ${clientNum}`,
                      profileId: String(clientNum),
                    };

                    // Add new customer to list immediately
                    setCustomers((prev) => {
                      const exists = prev.some(
                        (c) => c.id === String(clientNum)
                      );
                      if (exists) {
                        return prev;
                      }
                      return [...prev, newCustomerUI];
                    });

                    // Refresh customers list from server to ensure consistency
                    fetchCustomers().catch((err) => {
                      console.error("Error refreshing customers list:", err);
                    });

                    // Select the new customer (this will trigger profile fetch via useEffect)
                    setSelectedCustomer(newCustomerUI);

                    // Update churn risk - handle different response formats
                    if (domain === "isp") {
                      const prob = json.prediction?.churn_probability_percent;
                      if (prob !== undefined) {
                        setChurnRisk(Math.round(prob));
                      }
                    } else if (domain === "insurance") {
                      const probStr = json.prediction?.probability;
                      if (probStr && typeof probStr === "string") {
                        const probNum = parseFloat(probStr.replace("%", ""));
                        if (!isNaN(probNum)) {
                          setChurnRisk(Math.round(probNum));
                        }
                      }
                    } else {
                      // Credit Card
                      if (json.prediction?.probability_percent !== undefined) {
                        setChurnRisk(
                          Math.round(json.prediction.probability_percent)
                        );
                      }
                    }

                    // Show success toast
                    toast({
                      title: "Customer Created Successfully",
                      description: `New customer ${clientNum} has been created and churn risk calculated.`,
                    });

                    // Reset form
                    setNewCustomer({
                      Customer_Age: "",
                      Gender: "",
                      Dependent_count: "",
                      Education_Level: "",
                      Marital_Status: "",
                      Income_Category: "",
                      Card_Category: "",
                      Months_on_book: "",
                      Total_Relationship_Count: "",
                      Months_Inactive_12_mon: "",
                      Contacts_Count_12_mon: "",
                      Credit_Limit: "",
                      Total_Revolving_Bal: "",
                      Avg_Open_To_Buy: "",
                      Total_Amt_Chng_Q4_Q1: "",
                      Total_Trans_Amt: "",
                      Total_Trans_Ct: "",
                      Total_Ct_Chng_Q4_Q1: "",
                      Avg_Utilization_Ratio: "",
                    });

                    // Close modal only after successful creation
                    setIsCreateOpen(false);
                  } catch (error) {
                    console.error("Error creating customer:", error);
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : "Something went wrong while saving the customer. Please try again.";

                    toast({
                      title: "Unable to create customer",
                      description: errorMessage,
                      variant: "destructive",
                    });
                    // Do NOT close modal on error
                  } finally {
                    setIsCreating(false);
                  }
                }}
              >
                {isCreating ? "Creating..." : "Create & Predict"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfiles;
