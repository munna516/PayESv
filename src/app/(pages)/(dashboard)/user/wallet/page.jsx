"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import { FaEdit } from "react-icons/fa";

export default function Wallet() {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("mobile");

  const [walletProvider, setWalletProvider] = useState("");

  // Add new state for bKash fields
  const [merchantNumber, setMerchantNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Add new state for Binance fields
  const [binanceProvider, setBinanceProvider] = useState("Binance");
  const [binanceId, setBinanceId] = useState("");
  const [binanceApiKey, setBinanceApiKey] = useState("");
  const [binanceApiSecret, setBinanceApiSecret] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wallet"],
    queryFn: () =>
      fetch(`/api/user/wallet?email=${session?.user?.email}`).then((res) =>
        res.json()
      ),
    enabled: !!session?.user?.email,
  });

  if (isLoading) {
    return <Loading />;
  }
  const wallet = data?.rows;

  // Filter wallet data by type
  const mobileData =
    wallet?.filter((item) => item.wallet_provider === "bKash") || [];

  const netBankingData =
    wallet?.filter((item) => item.wallet_provider === "Binance") || [];

  const resetForm = () => {
    setMerchantNumber("");
    setApiKey("");
    setApiSecret("");
    setUsername("");
    setPassword("");
    setBinanceProvider("Binance");
    setBinanceId("");
    setBinanceApiKey("");
    setBinanceApiSecret("");
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingId(item.id);

    if (item.wallet_provider === "bKash") {
      setActiveTab("mobile");
      setWalletProvider(item.wallet_provider || "bKash");
      setMerchantNumber(item.merchant_number || "");
      setApiKey(item.api_key || "");
      setApiSecret(item.api_secret || "");
      setUsername(item.username || "");
      setPassword(item.password || "");
    } else if (item.wallet_provider === "Binance") {
      setActiveTab("netbank");
      setBinanceProvider(item.wallet_provider || "Binance");
      setBinanceId(item.binance_id || "");
      setBinanceApiKey(item.binance_api_key || "");
      setBinanceApiSecret(item.binance_api_secret || "");
    }

    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setActiveTab("mobile");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data, type) => {
    if (type === "card") {
      toast.error("Card is disabled");
      return;
    }
    if (type === "mobile") {
      if (!merchantNumber || !apiKey || !apiSecret || !username || !password) {
        toast.error("Please fill all the fields");
        return;
      }
    }
    if (type === "netbank") {
      if (!binanceId || !binanceApiKey || !binanceApiSecret) {
        toast.error("Please fill all the fields");
        return;
      }
    }

    try {
      const url = isEditMode
        ? `/api/user/wallet?id=${editingId}`
        : "/api/user/wallet";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          email: session?.user?.email,
          id: editingId,
          ...data,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(result.message);
        refetch();
      } else {
        const result = await res.json();
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save data");
    } finally {
      resetForm();
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="mb-20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Wallet</h1>
            <p className="text-gray-600 mt-1">
              Manage your payment methods and wallet information
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" onClick={handleAddNew}>
                + Add Wallet Info
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode
                    ? "Edit Wallet Information"
                    : "Add Wallet Information"}
                </DialogTitle>
                <DialogDescription>
                  Add your payment method information
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card" disabled>
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="mobile">Mobile Banking</TabsTrigger>
                  <TabsTrigger value="netbank">Net Banking</TabsTrigger>
                </TabsList>

                {/* Mobile Banking Section */}
                <TabsContent value="mobile">
                  <div className="space-y-4">
                    <div>
                      <Label>Provider</Label>
                      <Input value="bKash" disabled />
                    </div>
                    <div>
                      <Label>Merchant Number</Label>
                      <Input
                        value={merchantNumber}
                        required
                        onChange={(e) => setMerchantNumber(e.target.value)}
                        placeholder="Merchant Number"
                      />
                    </div>
                    <div>
                      <Label>API Key</Label>
                      <Input
                        value={apiKey}
                        required
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="API Key"
                      />
                    </div>
                    <div>
                      <Label>API Secret</Label>
                      <Input
                        value={apiSecret}
                        required
                        onChange={(e) => setApiSecret(e.target.value)}
                        placeholder="API Secret"
                      />
                    </div>
                    <div>
                      <Label>Username / App Key</Label>
                      <Input
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username / App Key"
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                      />
                    </div>

                    <Button
                      variant="primary"
                      className="w-full mt-2"
                      onClick={() =>
                        handleSubmit(
                          {
                            walletProvider: "bKash",
                            merchantNumber,
                            apiKey,
                            apiSecret,
                            username,
                            password,
                          },
                          "mobile"
                        )
                      }
                    >
                      {isEditMode ? "Update Wallet Info" : "Save Wallet Info"}
                    </Button>
                  </div>
                </TabsContent>

                {/* Net Banking Section */}
                <TabsContent value="netbank">
                  <div className="space-y-4">
                    <div>
                      <Label>Provider</Label>
                      <Input value="Binance" disabled />
                    </div>
                    <div>
                      <Label>Binance ID</Label>
                      <Input
                        value={binanceId}
                        required
                        onChange={(e) => setBinanceId(e.target.value)}
                        placeholder="Binance ID"
                      />
                    </div>
                    <div>
                      <Label>Binance API Key</Label>
                      <Input
                        value={binanceApiKey}
                        required
                        onChange={(e) => setBinanceApiKey(e.target.value)}
                        placeholder="Binance API Key"
                      />
                    </div>
                    <div>
                      <Label>Binance API Secret</Label>
                      <Input
                        value={binanceApiSecret}
                        required
                        onChange={(e) => setBinanceApiSecret(e.target.value)}
                        placeholder="Binance API Secret"
                        type="password"
                      />
                    </div>

                    <Button
                      variant="primary"
                      className="w-full mt-2"
                      onClick={() =>
                        handleSubmit(
                          {
                            walletProvider: "Binance",
                            binanceId,
                            binanceApiKey,
                            binanceApiSecret,
                          },
                          "netbank"
                        )
                      }
                    >
                      {isEditMode ? "Update Wallet Info" : "Save Wallet Info"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          {/* Card Table */}

          {/* Mobile Banking Table */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Mobile Banking</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Merchant Number</TableHead>
                      <TableHead>Bkash API Key</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mobileData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-gray-500"
                        >
                          No mobile banking information found
                        </TableCell>
                      </TableRow>
                    ) : (
                      mobileData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.wallet_provider}</TableCell>
                          <TableCell>{item.merchant_number}</TableCell>
                          <TableCell>{item.api_key}</TableCell>

                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit className="text-green-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Net Banking Table */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Net Banking</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Binance ID</TableHead>
                      <TableHead>Binance API Key</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {netBankingData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-gray-500"
                        >
                          No net banking information found
                        </TableCell>
                      </TableRow>
                    ) : (
                      netBankingData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.wallet_provider}</TableCell>
                          <TableCell>{item.binance_id}</TableCell>
                          <TableCell>{item.binance_api_key}</TableCell>

                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit className="text-green-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
