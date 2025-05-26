"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dummyProfile from "../../../../../../public/assets/images/dummyProfile.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UserCircle,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Edit2,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { format } from "date-fns";

export default function AdminProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    phone: "",
    location: "",
    company: "",
  });

  console.log(session);

  const handleEditClick = () => {
    if (!isEditing) {
      // Initialize edited profile with current values
      setEditedProfile({
        name: session?.user?.name,
        phone: session?.user?.phone,
        location: session?.user?.location,
        company: session?.user?.company,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = () => {
    // Validate the edited fields
    if (!editedProfile.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    // Implement profile update logic here
    // Note: email is not included in the update
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Implement password change logic
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed successfully!");
  };

  return (
    <div className="space-y-6 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <CardTitle className="text-xl font-bold">
                    Profile Information
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  onClick={handleEditClick}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b dark:border-slate-600">
                  <div className="relative">
                    <Image
                      src={session?.user?.image || dummyProfile}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="h-12 w-12 lg:w-20 lg:h-20 rounded-full border-4 border-green-100 shadow mb-2"
                    />
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    {isEditing ? (
                      <Input
                        value={session?.user?.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            name: e.target.value,
                          })
                        }
                        className="text-2xl font-bold mb-2"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">
                        {session?.user?.name}
                      </h2>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {session?.user?.email}
                      </p>
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        session?.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {session?.status === "active" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {session?.status?.charAt(0).toUpperCase() +
                        session?.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{session?.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        {isEditing ? (
                          <Input
                            value={editedProfile.phone}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                phone: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium">
                            {session?.phone || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Join Date
                        </p>
                        <p className="font-medium">
                          {session?.created_at
                            ? format(new Date(session.created_at), "d-M-yyyy")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        {isEditing ? (
                          <Input
                            value={editedProfile.location}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                location: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium">
                            {session?.street_address || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        {isEditing ? (
                          <Input
                            value={editedProfile.company}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                company: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium">
                            {session?.company || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <div>
          <Card className="dark:bg-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle className="text-xl font-bold">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Dialog
                  open={isChangingPassword}
                  onOpenChange={setIsChangingPassword}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Shield className="h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="dark:bg-slate-700">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={handlePasswordChange}
                      >
                        Update Password
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="p-4 bg-green-50 dark:bg-slate-600 rounded-lg">
                  <h3 className="font-semibold mb-2">Security Tips</h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Use a strong, unique password</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Keep your contact information updated</li>
                    <li>• Never share your password with anyone</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
