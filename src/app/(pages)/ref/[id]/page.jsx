"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Gift,
  Users,
  Star,
  ArrowRight,
  Copy,
  Share2,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function ReferralPage({ params }) {
  const [referrerName, setReferrerName] = useState("Your Friend");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate loading referral data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralBenefits = [
    {
      icon: <Gift className="h-6 w-6 text-green-500" />,
      title: "Welcome Bonus",
      description:
        "Purchase when you sign up through this referral",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Community Access",
      description: "Join our exclusive community of verified users",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Premium Features",
      description: "Unlock premium features from day one",
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-500" />,
      title: "Fast Setup",
      description: "Quick and easy account setup process",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referral information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Header */}
      <div className=" px-4 py-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Users className="h-4 w-4 mr-2" />
            Referral Invitation
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You've been invited to join{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-600">
              PAYESV
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {referrerName} thinks you'd love our platform! Join thousands of
            users who trust us for their payment solutions.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Special Welcome Offer</CardTitle>
              <CardDescription className="text-lg">
                Sign up today and get exclusive benefits just for you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {referralBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50/50"
                  >
                    <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Sign Up Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Ready to Get Started?
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Create your account in just 2 minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Free account creation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Instant verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Secure payment processing</span>
                  </div>
                  <Link href="/register">
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 mt-4">
                      Sign Up Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Learn More Card */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-6 w-6 mr-2 text-yellow-500" />
                  Why Choose PAYESV?
                </CardTitle>
                <CardDescription>
                  Discover what makes us different
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Bank-level Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Global Payment Solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Competitive Rates</span>
                  </div>
                  <Link href="/">
                    <Button variant="outline" className="w-full mt-4">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Share Section */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="text-center">
              <CardTitle>Share This Referral Link</CardTitle>
              <CardDescription>
                Help others discover PAYESV and earn rewards together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  value={window.location.href}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopyLink} variant="outline">
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {copied
                  ? "Link copied to clipboard!"
                  : "Click to copy your referral link"}
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <Separator className="mb-6" />
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
