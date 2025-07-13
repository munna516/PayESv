"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  const [activeTab, setActiveTab] = useState("card");

  const [cardType, setCardType] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [netBankProvider, setNetBankProvider] = useState("");

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [walletNumber, setWalletNumber] = useState("");
  const [walletAccountType, setWalletAccountType] = useState("");

  const [netBankEmailOrId, setNetBankEmailOrId] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wallet"],
    queryFn: () =>
      fetch(`/api/user/wallet?email=${session?.user?.email}`).then((res) =>
        res.json()
      ),
  });

  if (isLoading) {
    return <Loading />;
  }
  const wallet = data?.rows;
  console.log("Wallet: ", wallet);

  // Filter wallet data by type
  const cardData = wallet?.filter((item) => item.type === "card") || [];
  const mobileData = wallet?.filter((item) => item.type === "mobile") || [];
  const netbankData = wallet?.filter((item) => item.type === "netbank") || [];

  const resetForm = () => {
    setCardType("");
    setWalletProvider("");
    setNetBankProvider("");
    setCardholderName("");
    setCardNumber("");
    setExpiryDate("");
    setBillingAddress("");
    setWalletNumber("");
    setWalletAccountType("");
    setNetBankEmailOrId("");
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setActiveTab(item.type);

    if (item.type === "card") {
      setCardType(item.card_type || "");
      setCardholderName(item.card_holder_name || "");
      setCardNumber(item.card_number || "");
      setExpiryDate(item.expiry_date || "");
      setBillingAddress(item.billing_address || "");
    } else if (item.type === "mobile") {
      setWalletProvider(item.wallet_provider || "");
      setWalletNumber(item.wallet_number || "");
      setWalletAccountType(item.wallet_account_type || "");
    } else if (item.type === "netbank") {
      setNetBankProvider(item.net_bank_provider || "");
      setNetBankEmailOrId(item.net_bank_email_or_id || "");
    }

    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setActiveTab("card");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data, type) => {
    if (type === "card") {
      if (
        !cardType ||
        !cardholderName ||
        !cardNumber ||
        !expiryDate ||
        !billingAddress
      ) {
        toast.error("Please fill all the fields");
        return;
      }
    }
    if (type === "mobile") {
      if (!walletProvider || !walletNumber || !walletAccountType) {
        toast.error("Please fill all the fields");
        return;
      }
    }
    if (type === "netbank") {
      if (!netBankProvider || !netBankEmailOrId) {
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
                  Choose your preferred payment method and provide the necessary
                  details.
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile Banking</TabsTrigger>
                  <TabsTrigger value="netbank">Net Banking</TabsTrigger>
                </TabsList>

                {/* Card Section */}
                <TabsContent value="card">
                  <div className="space-y-4">
                    <div>
                      <Label>Card Type</Label>
                      <Select onValueChange={setCardType} value={cardType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DBBL Nexus">DBBL Nexus</SelectItem>
                          <SelectItem value="Visa">Visa</SelectItem>
                          <SelectItem value="MasterCard">MasterCard</SelectItem>
                          <SelectItem value="Amex">AMEX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cardholder Name</Label>
                      <Input
                        value={cardholderName}
                        required
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label>Card Number</Label>
                      <Input
                        value={cardNumber}
                        required
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 1234"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expiry Date</Label>
                        <Input
                          value={expiryDate}
                          required
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label>Billing Address</Label>
                        <Input
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="123 Street Name"
                        />
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full mt-5"
                      onClick={() =>
                        handleSubmit(
                          {
                            cardType,
                            cardholderName,
                            cardNumber,
                            expiryDate,
                            billingAddress,
                          },
                          "card"
                        )
                      }
                    >
                      {isEditMode ? "Update Card Info" : "Save Card Info"}
                    </Button>
                  </div>
                </TabsContent>

                {/* Mobile Banking Section */}
                <TabsContent value="mobile">
                  <div className="space-y-4">
                    <div>
                      <Label>Provider</Label>
                      <Select
                        onValueChange={setWalletProvider}
                        value={walletProvider}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bKash">bKash</SelectItem>
                          <SelectItem value="Nagad">Nagad</SelectItem>
                          <SelectItem value="Rocket">Rocket</SelectItem>
                          <SelectItem value="Upay">Upay</SelectItem>
                          <SelectItem value="okwallet">OK Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Wallet Number</Label>
                      <Input
                        value={walletNumber}
                        required
                        onChange={(e) => setWalletNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <Select
                        onValueChange={setWalletAccountType}
                        value={walletAccountType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Merchant">Merchant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full mt-2"
                      onClick={() =>
                        handleSubmit(
                          { walletProvider, walletNumber, walletAccountType },
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
                      <Select
                        onValueChange={setNetBankProvider}
                        value={netBankProvider}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Binance">Binance</SelectItem>
                          <SelectItem value="Stripe">Stripe</SelectItem>
                          <SelectItem value="PayPal">PayPal</SelectItem>
                          <SelectItem value="Payoneer">Payoneer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Account Email / ID</Label>
                      <Input
                        value={netBankEmailOrId}
                        required
                        onChange={(e) => setNetBankEmailOrId(e.target.value)}
                        placeholder="example@domain.com or acct_12345"
                      />
                    </div>
                    <Button
                      variant="primary"
                      className="w-full mt-2"
                      onClick={() =>
                        handleSubmit(
                          { netBankProvider, netBankEmailOrId },
                          "netbank"
                        )
                      }
                    >
                      {isEditMode
                        ? "Update Net Banking Info"
                        : "Save Net Banking Info"}
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
          <div>
            <h2 className="text-lg font-semibold mb-3">Card</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Cardholder Name</TableHead>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Billing Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cardData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500"
                        >
                          No card information found
                        </TableCell>
                      </TableRow>
                    ) : (
                      cardData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.card_type}</TableCell>
                          <TableCell>{item.card_holder_name}</TableCell>
                          <TableCell>{item.card_number}</TableCell>
                          <TableCell>{item.expiry_date}</TableCell>
                          <TableCell>{item.billing_address}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                             
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

          {/* Mobile Banking Table */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Mobile Banking</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Wallet Number</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mobileData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          No mobile banking information found
                        </TableCell>
                      </TableRow>
                    ) : (
                      mobileData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.wallet_provider}</TableCell>
                          <TableCell>{item.wallet_number}</TableCell>
                          <TableCell>{item.wallet_account_type}</TableCell>
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
                      <TableHead>Provider</TableHead>
                      <TableHead>Account Email / ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {netbankData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500"
                        >
                          No net banking information found
                        </TableCell>
                      </TableRow>
                    ) : (
                      netbankData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.net_bank_provider}</TableCell>
                          <TableCell>{item.net_bank_email_or_id}</TableCell>
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
