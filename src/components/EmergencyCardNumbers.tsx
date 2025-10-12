import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, AlertTriangle, CreditCard, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmergencyNumber {
  region: string;
  number: string;
  collectCall?: boolean;
}

interface CardProvider {
  name: string;
  logo: string;
  color: string;
  numbers: EmergencyNumber[];
  website: string;
}

const CARD_PROVIDERS: CardProvider[] = [
  {
    name: "Visa",
    logo: "💳",
    color: "from-blue-500 to-blue-600",
    website: "visa.com",
    numbers: [
      { region: "Global", number: "+1-303-967-1096", collectCall: true },
      { region: "North America", number: "+1-800-847-2911" },
      { region: "Europe", number: "+44-20-7795-9500" },
      { region: "Asia Pacific", number: "+65-6800-1111" },
      { region: "Latin America", number: "+1-305-260-3333" },
    ],
  },
  {
    name: "Mastercard",
    logo: "💳",
    color: "from-orange-500 to-red-500",
    website: "mastercard.com",
    numbers: [
      { region: "Global", number: "+1-636-722-7111" },
      { region: "North America", number: "+1-800-627-8372" },
      { region: "Europe", number: "+44-20-7557-3900" },
      { region: "Asia Pacific", number: "+65-6557-4892" },
      { region: "Latin America", number: "+1-636-722-7111" },
    ],
  },
  {
    name: "American Express",
    logo: "💳",
    color: "from-cyan-600 to-blue-700",
    website: "americanexpress.com",
    numbers: [
      { region: "Global", number: "+1-336-393-1111", collectCall: true },
      { region: "North America", number: "+1-800-528-4800" },
      { region: "Europe", number: "+44-20-7365-4000" },
      { region: "Asia Pacific", number: "+65-6535-2209" },
      { region: "Latin America", number: "+52-55-5257-7000" },
    ],
  },
  {
    name: "Discover",
    logo: "💳",
    color: "from-orange-600 to-orange-700",
    website: "discover.com",
    numbers: [
      { region: "Global", number: "+1-801-902-3100" },
      { region: "North America", number: "+1-800-347-2683" },
    ],
  },
  {
    name: "Diners Club",
    logo: "💳",
    color: "from-slate-600 to-slate-700",
    website: "dinersclub.com",
    numbers: [
      { region: "Global", number: "+1-303-799-1504", collectCall: true },
      { region: "North America", number: "+1-800-234-6377" },
      { region: "Europe", number: "+44-1244-470-910" },
    ],
  },
];

export default function EmergencyCardNumbers() {
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCall = (number: string, providerName: string) => {
    window.location.href = `tel:${number}`;
    toast({
      title: "Calling Emergency Number",
      description: `Connecting to ${providerName} emergency hotline...`,
    });
  };

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast({
      title: "Number Copied",
      description: "Emergency number copied to clipboard",
    });
  };

  const allRegions = ["Global", "North America", "Europe", "Asia Pacific", "Latin America"];

  return (
    <div className="space-y-6">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Emergency Card Hotlines</CardTitle>
              <CardDescription className="text-base">
                Lost or stolen card? Call these numbers immediately to block your card
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Select Region:</span>
        </div>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CARD_PROVIDERS.map((provider) => {
          const regionNumber = provider.numbers.find((n) => n.region === selectedRegion);
          const isSelected = selectedCard === provider.name;

          return (
            <Card
              key={provider.name}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => setSelectedCard(provider.name)}
            >
              <CardHeader>
                <div className={`w-full h-24 rounded-lg bg-gradient-to-r ${provider.color} flex items-center justify-center text-4xl mb-4`}>
                  {provider.logo}
                </div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {provider.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Emergency hotline • {provider.website}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {regionNumber ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-xs text-muted-foreground mb-1">
                        {regionNumber.region}
                        {regionNumber.collectCall && " (Collect Call)"}
                      </div>
                      <div className="text-lg font-mono font-semibold">
                        {regionNumber.number}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(regionNumber.number, provider.name);
                        }}
                        className="flex-1"
                        variant="destructive"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyNumber(regionNumber.number);
                        }}
                        variant="outline"
                        size="icon"
                      >
                        📋
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Use Global number for this region
                  </div>
                )}

                {selectedCard === provider.name && (
                  <div className="pt-3 border-t space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">
                      All Available Numbers:
                    </div>
                    {provider.numbers
                      .filter((n) => n.region !== selectedRegion)
                      .map((num) => (
                        <div
                          key={num.region}
                          className="flex justify-between items-center text-xs p-2 rounded bg-muted/50"
                        >
                          <span className="font-medium">{num.region}:</span>
                          <span className="font-mono">{num.number}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">⚡ Emergency Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li><strong>Call immediately</strong> - Contact your card issuer's emergency hotline</li>
            <li><strong>Report as lost/stolen</strong> - They will block your card instantly</li>
            <li><strong>Request emergency card</strong> - Ask for emergency cash or card replacement</li>
            <li><strong>File police report</strong> - Get a copy for insurance claims</li>
            <li><strong>Monitor statements</strong> - Check for unauthorized transactions</li>
            <li><strong>Update autopay</strong> - Update any recurring payments with new card</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
